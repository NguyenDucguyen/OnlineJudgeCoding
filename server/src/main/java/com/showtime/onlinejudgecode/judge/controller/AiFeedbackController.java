package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.response.AiFeedbackResponse;
import com.showtime.onlinejudgecode.judge.service.AiFeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiFeedbackController {

    private final AiFeedbackService aiFeedbackService;

    public AiFeedbackController(AiFeedbackService aiFeedbackService) {
        this.aiFeedbackService = aiFeedbackService;
    }

    @PostMapping("/submissions/{submissionId}/feedback")
    public ResponseEntity<?> generateFeedback(@PathVariable Long submissionId) {
        try {
            AiFeedbackResponse response = aiFeedbackService.generateFeedback(submissionId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không tạo được feedback: " + e.getMessage());
        }
    }
}
