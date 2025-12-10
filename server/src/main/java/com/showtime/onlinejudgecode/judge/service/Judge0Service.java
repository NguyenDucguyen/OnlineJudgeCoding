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

    private final String judge0Url;


    public Judge0Service(WebClient.Builder webClientBuilder,
                         @Value("${judge0.api.url:http://localhost:2358}") String judge0Url) {

        log.info("Connecting to Judge0 at: {}", judge0Url);

        this.judge0Url = judge0Url;

        this.webClient = webClientBuilder
                .baseUrl(judge0Url)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
    }

    /**
     * Submit code to Judge0
     */
    public Mono<String> submitCode(Judge0Request request) {
        return webClient.post()
                .uri("/submissions?base64_encoded=false&wait=false")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.value() >= 400,
                        response -> response.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Judge0 API Error at {}: {}", this.judge0Url, body); // Ví dụ dùng lại biến judge0Url ở đây
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
                .uri(uriBuilder -> uriBuilder
                        .path("/submissions/{token}") // Chỉ cần path tương đối
                        .queryParam("base64_encoded", "true")
                        .queryParam("fields", "*")
                        .build(token))
                .retrieve()
                .bodyToMono(Judge0Response.class)
                .onErrorResume(e -> {
                    System.err.println("Lỗi khi gọi Judge0 GET tại " + this.judge0Url + ": " + e.getMessage());
                    return Mono.error(e);
                });
    }

    /**
     * Wait for submission to complete (polling)
     */
    public Mono<Judge0Response> waitForResult(String token, int maxAttempts) {
        Duration interval = Duration.ofMillis(800);
        int attempts = Math.max(maxAttempts, 40);

        return Mono.delay(Duration.ofMillis(500))
                .then(getSubmissionResult(token))
                .flatMap(resp -> {
                    Integer st = resp.getStatus() != null ? resp.getStatus().getId() : null;
                    if (st != null && st > 2) return Mono.just(resp);
                    return Mono.error(new RuntimeException("Still processing"));
                })
                .retryWhen(
                        Retry.fixedDelay(attempts, interval)
                                .filter(ex -> "Still processing".equals(ex.getMessage()))
                )
                .timeout(Duration.ofSeconds(90));
    }
}