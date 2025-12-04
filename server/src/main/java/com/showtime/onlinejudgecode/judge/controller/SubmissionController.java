package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.request.SubmissionRequest;
import com.showtime.onlinejudgecode.judge.dto.response.SubmissionResponse;
import com.showtime.onlinejudgecode.judge.entity.Submission;
import com.showtime.onlinejudgecode.judge.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.List;

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
        String userId = getUserIdFromAuth(authentication);

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
    public ResponseEntity<List<Submission>> getMySubmissions(Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        List<Submission> submissions = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Get specific submission details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long id, Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        Submission submission = submissionService.getSubmissionById(id);

        boolean isOwner = submission.getUser() != null && userId.equals(submission.getUser().getId());
        boolean isAdmin = hasAuthority(authentication, "ROLE_ADMIN");

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền truy cập submission này");
        }

        return ResponseEntity.ok(submission);
    }

    /**
     * Get all submissions for a problem (for leaderboard)
     */
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<Submission>> getProblemSubmissions(@PathVariable Long problemId) {
        List<Submission> submissions = submissionService.getProblemSubmissions(problemId);
        return ResponseEntity.ok(submissions);
    }

    private String getUserIdFromAuth(Authentication authentication) {
        Authentication auth = authentication != null ? authentication : SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bạn cần đăng nhập");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof com.showtime.onlinejudgecode.auth.model.CustomUserDetails userDetails) {
            return userDetails.getId();
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không thể xác thực người dùng");
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority::equals);
    }
}