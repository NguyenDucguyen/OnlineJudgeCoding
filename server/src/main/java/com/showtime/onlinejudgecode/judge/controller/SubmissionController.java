package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.request.SubmissionRequest;
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
                                                           Authentication authentication) {
        String userId = String.valueOf(getUserIdFromAuth(authentication));

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

                .onErrorResume(IllegalArgumentException.class, ex -> {
                    SubmissionResponse err = new SubmissionResponse();
                    err.setStatus("INVALID_REQUEST");
                    err.setErrorMessage(ex.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err));
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
    public ResponseEntity<List<Submission>> getMySubmissions(Authentication authentication) {
        String userId = String.valueOf(getUserIdFromAuth(authentication));
        List<Submission> submissions = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Get specific submission details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long id) {
        // Add authorization check here
        return ResponseEntity.ok().build();
    }

    /**
     * Get all submissions for a problem (for leaderboard)
     */
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<Submission>> getProblemSubmissions(@PathVariable Long problemId) {
        List<Submission> submissions = submissionService.getProblemSubmissions(problemId);
        return ResponseEntity.ok(submissions);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        // Extract user ID from JWT token
        // This depends on your authentication implementation
        return 1L; // Replace with actual implementation
    }
}