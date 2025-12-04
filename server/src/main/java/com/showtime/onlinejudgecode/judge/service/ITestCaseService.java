package com.showtime.onlinejudgecode.judge.service;

import com.showtime.onlinejudgecode.judge.dto.request.TestCaseRequest;
import com.showtime.onlinejudgecode.judge.dto.response.TestCaseResponse;

import java.util.List;

public interface ITestCaseService {
    List<TestCaseResponse> getTestCasesByProblem(Long problemId);
    TestCaseResponse createTestCase(Long problemId, TestCaseRequest request);
}
