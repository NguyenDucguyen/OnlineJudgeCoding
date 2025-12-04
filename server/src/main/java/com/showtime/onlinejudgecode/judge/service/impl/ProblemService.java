package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.judge.dto.request.ProblemRequest;
import com.showtime.onlinejudgecode.judge.dto.request.TestCaseRequest;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.service.IProblemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProblemService implements IProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    @Override
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id " + id));
    }

    @Override
    @Transactional
    public Problem createProblem(ProblemRequest request) {
        Problem problem = new Problem();
        mapProblemFields(problem, request);
        return problemRepository.save(problem);
    }

    @Override
    @Transactional
    public Problem updateProblem(Long id, ProblemRequest request) {
        Problem existing = getProblemById(id);
        existing.getTestCases().clear();
        mapProblemFields(existing, request);
        return problemRepository.save(existing);
    }

    @Override
    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }

    private void mapProblemFields(Problem problem, ProblemRequest request) {
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());

        List<TestCase> testCases = new ArrayList<>();
        if (request.getTestCases() != null) {
            for (TestCaseRequest tcRequest : request.getTestCases()) {
                TestCase testCase = new TestCase();
                testCase.setProblem(problem);
                testCase.setInput(tcRequest.getInput());
                testCase.setExpectedOutput(tcRequest.getExpectedOutput());
                testCase.setHidden(tcRequest.getHidden() != null ? tcRequest.getHidden() : false);
                testCases.add(testCase);
            }
        }
        problem.setTestCases(testCases);
    }
}
