package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.request.TestCaseRequest;
import com.showtime.onlinejudgecode.judge.dto.response.TestCaseResponse;
import com.showtime.onlinejudgecode.judge.service.ITestCaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems/{problemId}/tests")
public class TestCaseController {

    private final ITestCaseService testCaseService;

    public TestCaseController(ITestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @GetMapping
    public ResponseEntity<List<TestCaseResponse>> getTests(@PathVariable Long problemId) {
        List<TestCaseResponse> testCases = testCaseService.getTestCasesByProblem(problemId);
        return ResponseEntity.ok(testCases);
    }

    @PostMapping
    public ResponseEntity<TestCaseResponse> createTest(@PathVariable Long problemId,
                                                       @Valid @RequestBody TestCaseRequest request) {
        TestCaseResponse created = testCaseService.createTestCase(problemId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
