package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.request.SubmissionRequest;
import com.showtime.onlinejudgecode.judge.dto.response.SubmissionHistoryResponse;
import com.showtime.onlinejudgecode.judge.dto.response.SubmissionResponse;
import com.showtime.onlinejudgecode.judge.entity.Submission;
import com.showtime.onlinejudgecode.judge.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {


    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    /**
     * Submit code for a problem
     */
    @PostMapping
    public Mono<ResponseEntity<SubmissionResponse>> submit(@RequestBody SubmissionRequest request,
                                                           Authentication authentication,
                                                           @RequestParam(value = "userId", required = false) String userIdParam) {
        String userId = resolveUserId(authentication, request.getUserId(), userIdParam);

        return submissionService.submitCode(request, userId)
                .map(ResponseEntity::ok)

                .onErrorResume(WebClientResponseException.class, ex -> {
                    SubmissionResponse err = new SubmissionResponse();
                    err.setStatus("JUDGE0_ERROR");
                    err.setErrorMessage("Judge0 " + ex.getRawStatusCode() + ": " + ex.getResponseBodyAsString());
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(err));
                })

                .onErrorResume(java.util.concurrent.TimeoutException.class, ex -> {
                    SubmissionResponse err = new SubmissionResponse();
                    err.setStatus("JUDGE0_TIMEOUT");
                    err.setErrorMessage(ex.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT).body(err));
                })

                .onErrorResume(ex -> {
                    SubmissionResponse err = new SubmissionResponse();
                    err.setStatus("INTERNAL_ERROR");
                    err.setErrorMessage(ex.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err));
                });
    }



    /**
     * Get user's submission history
     */
    @GetMapping("/my-submissions")
    public ResponseEntity<List<SubmissionHistoryResponse>> getMySubmissions(Authentication authentication,
                                                                            @RequestParam(value = "userId", required = false) String userIdParam) {
        String userId = resolveUserId(authentication, null, userIdParam);
        List<SubmissionHistoryResponse> submissions = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Get specific submission details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long id) {
        return submissionService.getSubmission(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all submissions for a problem (for leaderboard)
     */
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<SubmissionHistoryResponse>> getProblemSubmissions(@PathVariable Long problemId) {
        List<SubmissionHistoryResponse> submissions = submissionService.getProblemSubmissions(problemId);
        return ResponseEntity.ok(submissions);
    }

    private String resolveUserId(Authentication authentication, String requestUserId, String requestParamUserId) {
        if (requestUserId != null && !requestUserId.isBlank()) {
            return requestUserId;
        }
        if (requestParamUserId != null && !requestParamUserId.isBlank()) {
            return requestParamUserId;
        }
        if (authentication != null && authentication.getName() != null) {
            return authentication.getName();
        }
        return null;
    }
}