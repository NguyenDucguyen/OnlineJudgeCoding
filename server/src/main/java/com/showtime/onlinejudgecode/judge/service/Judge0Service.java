package com.showtime.onlinejudgecode.judge.service;


import com.showtime.onlinejudgecode.judge.dto.request.Judge0Request;
import com.showtime.onlinejudgecode.judge.dto.response.Judge0Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import reactor.util.retry.Retry;

import java.time.Duration;

@Service
public class Judge0Service {

    private final WebClient webClient;

    private static final Logger log = LoggerFactory.getLogger(Judge0Service.class);
    @Value("${judge0.api.url}")
    private String judge0Url;

    public Judge0Service(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Submit code to Judge0
     */
    public Mono<String> submitCode(Judge0Request request) {
        return webClient.post()
                .uri(judge0Url + "/submissions?base64_encoded=false&wait=false")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.value() >= 400,
                        response -> response.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Judge0 API Error: {}", body);
                                    return Mono.error(new RuntimeException("Judge0 error: " + body));
                                })
                )
                .bodyToMono(Judge0Response.class)
                .map(Judge0Response::getToken)
                .doOnSuccess(token -> log.info("Code submitted successfully. Token: {}", token))
                .doOnError(e -> log.error("Error submitting code", e))
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(2)));
    }

    /**
     * Get submission result from Judge0
     */
    public Mono<Judge0Response> getSubmissionResult(String token) {
        return webClient.get()
                .uri(judge0Url + "/submissions/" + token + "?base64_encoded=false")
                .retrieve()
                .bodyToMono(Judge0Response.class)
                .doOnSuccess(response -> log.info("Got result for token {}: {}",
                        token, response.getStatus().getDescription()))
                .doOnError(e -> log.error("Error getting submission result", e));
    }

    /**
     * Wait for submission to complete (polling)
     */
    public Mono<Judge0Response> waitForResult(String token, int maxAttempts) {
        Duration interval = Duration.ofMillis(800);   // poll ~0.8s
        int attempts = Math.max(maxAttempts, 40);     // tối thiểu 40 lần (~32s)

        return Mono.delay(Duration.ofMillis(500))     // đợi nửa giây cho job vào queue
                .then(getSubmissionResult(token))
                .flatMap(resp -> {
                    Integer st = resp.getStatus() != null ? resp.getStatus().getId() : null;
                    if (st != null && st > 2) return Mono.just(resp);           // hoàn thành
                    return Mono.error(new RuntimeException("Still processing"));
                })
                .retryWhen(
                        Retry.fixedDelay(attempts, interval)
                                .filter(ex -> "Still processing".equals(ex.getMessage()))
                )
                .timeout(Duration.ofSeconds(90));         // trần tối đa
    }


}