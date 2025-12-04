package com.showtime.onlinejudgecode.judge.controller;


import com.showtime.onlinejudgecode.judge.dto.request.ProblemRequest;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.service.impl.ProblemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblem(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(problemService.getProblemById(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody ProblemRequest request) {
        Problem saved = problemService.createProblem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody ProblemRequest request) {
        Problem updated = problemService.updateProblem(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }
}