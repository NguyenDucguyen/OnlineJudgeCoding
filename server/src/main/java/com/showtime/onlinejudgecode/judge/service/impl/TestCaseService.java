package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.judge.dto.request.TestCaseRequest;
import com.showtime.onlinejudgecode.judge.dto.response.TestCaseResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.repository.TestCaseRepository;
import com.showtime.onlinejudgecode.judge.service.ITestCaseService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestCaseService implements ITestCaseService {
    private static final int MAX_FIELD_LENGTH = 5000;

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    public TestCaseService(ProblemRepository problemRepository, TestCaseRepository testCaseRepository) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
    }

    @Override
    public List<TestCaseResponse> getTestCasesByProblem(Long problemId) {
        if (!problemRepository.existsById(problemId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found");
        }

        return testCaseRepository.findByProblemId(problemId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TestCaseResponse createTestCase(Long problemId, TestCaseRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        validateRequest(request);

        TestCase testCase = new TestCase();
        testCase.setProblem(problem);
        testCase.setInput(request.getInput().trim());
        testCase.setExpectedOutput(request.getExpectedOutput().trim());
        testCase.setHidden(request.getHidden());

        TestCase saved = testCaseRepository.save(testCase);
        return mapToResponse(saved);
    }

    private void validateRequest(TestCaseRequest request) {
        if (request.getInput() == null || request.getInput().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Input is required");
        }

        if (request.getExpectedOutput() == null || request.getExpectedOutput().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected output is required");
        }

        if (request.getHidden() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hidden flag must be provided");
        }

        if (request.getInput().length() > MAX_FIELD_LENGTH || request.getExpectedOutput().length() > MAX_FIELD_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Input or expected output is too long");
        }
    }

    private TestCaseResponse mapToResponse(TestCase testCase) {
        return TestCaseResponse.builder()
                .id(testCase.getId())
                .input(testCase.getInput())
                .expectedOutput(testCase.getExpectedOutput())
                .hidden(Boolean.TRUE.equals(testCase.getHidden()))
                .build();
    }
}
