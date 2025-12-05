package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.request.ContestRegistrationRequest;
import com.showtime.onlinejudgecode.judge.dto.request.ContestRequest;
import com.showtime.onlinejudgecode.judge.entity.Contest;
import com.showtime.onlinejudgecode.judge.entity.ContestRegistration;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.service.impl.ContestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    private final ContestService contestService;

    public ContestController(ContestService contestService) {
        this.contestService = contestService;
    }

    @GetMapping
    public ResponseEntity<List<Contest>> getAllContests() {
        return ResponseEntity.ok(contestService.getAllContests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contest> getContest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contestService.getContestById(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Contest> createContest(@RequestBody ContestRequest request) {
        Contest saved = contestService.createContest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contest> updateContest(@PathVariable Long id, @RequestBody ContestRequest request) {
        try {
            Contest updated = contestService.updateContest(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContest(@PathVariable Long id) {
        contestService.deleteContest(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/register")

    public ResponseEntity<?> registerForContest(@PathVariable Long id,
                                                @RequestBody ContestRegistrationRequest request) {
        try {
            ContestRegistration registration = contestService.registerForContest(id, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(registration);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", ex.getMessage(),
                    "status", 400
            ));
        }
    }

    @GetMapping("/{id}/registrations")
    public ResponseEntity<List<ContestRegistration>> getRegistrations(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contestService.getRegistrations(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/problems")
    public ResponseEntity<List<Problem>> getContestProblems(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contestService.getContestProblems(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}