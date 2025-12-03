package com.showtime.onlinejudgecode.judge.controller;


import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private final ProblemRepository problemRepository;

    public ProblemController(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    /**
     * Get all problems
     */
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();
        return ResponseEntity.ok(problems);
    }

    /**
     * Get problem by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblem(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new problem (Admin only)
     */
    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        Problem saved = problemRepository.save(problem);
        return ResponseEntity.ok(saved);
    }
}