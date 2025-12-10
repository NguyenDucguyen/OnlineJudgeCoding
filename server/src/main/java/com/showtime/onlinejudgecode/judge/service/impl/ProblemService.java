package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.judge.dto.request.ProblemRequest;
import com.showtime.onlinejudgecode.judge.dto.request.TestCaseRequest;
import com.showtime.onlinejudgecode.judge.dto.response.ProblemResponse;
import com.showtime.onlinejudgecode.judge.dto.response.TestCaseResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.service.IProblemService;
import org.hibernate.Hibernate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProblemService implements IProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    /**
     * Lấy danh sách tất cả bài tập.
     * Cache key cố định là 'all' để lưu nguyên list.
     * ⚠ Trả về DTO, không trả Entity để tránh lazy + Redis.
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "problems_list", key = "'all'")
    public List<ProblemResponse> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();

        // Danh sách chỉ cần info cơ bản, KHÔNG cần testCases -> không đụng vào collection lazy
        return problems.stream()
                .map(p -> mapToProblemResponse(p, false))
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết 1 bài tập.
     * Trả về DTO, trong đó có testCases.
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "problem_detail", key = "#id")
    public ProblemResponse getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id " + id));


        if (problem.getTestCases() != null) {
            Hibernate.initialize(problem.getTestCases());
        }

        return mapToProblemResponse(problem, true);
    }


    @Override
    @Transactional
    @CacheEvict(value = "problems_list", allEntries = true)
    public Problem createProblem(ProblemRequest request) {
        Problem problem = new Problem();
        mapProblemFields(problem, request);
        return problemRepository.save(problem);
    }


    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "problem_detail", key = "#id"),
            @CacheEvict(value = "problems_list", allEntries = true)
    })
    public Problem updateProblem(Long id, ProblemRequest request) {
        Problem existing = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id " + id));

        // Clear test cases cũ (nếu dùng orphanRemoval=true thì sẽ xóa luôn bên DB)
        if (existing.getTestCases() != null) {
            existing.getTestCases().clear();
        }

        mapProblemFields(existing, request);
        return problemRepository.save(existing);
    }


    @Override
    @Caching(evict = {
            @CacheEvict(value = "problem_detail", key = "#id"),
            @CacheEvict(value = "problems_list", allEntries = true)
    })
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
                testCase.setProblem(problem); // Quan trọng để map quan hệ 2 chiều
                testCase.setInput(tcRequest.getInput());
                testCase.setExpectedOutput(tcRequest.getExpectedOutput());
                testCase.setHidden(tcRequest.getHidden() != null ? tcRequest.getHidden() : false);
                testCases.add(testCase);
            }
        }

        if (problem.getTestCases() == null) {
            problem.setTestCases(testCases);
        } else {
            problem.getTestCases().addAll(testCases);
        }
    }


    private ProblemResponse mapToProblemResponse(Problem problem, boolean includeTestCases) {
        ProblemResponse dto = new ProblemResponse();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimit(problem.getTimeLimit());
        dto.setMemoryLimit(problem.getMemoryLimit());

        if (includeTestCases && problem.getTestCases() != null) {
            List<TestCaseResponse> tcDtos = problem.getTestCases().stream()
                    .map(tc -> {
                        TestCaseResponse t = new TestCaseResponse();
                        t.setId(tc.getId());
                        t.setInput(tc.getInput());
                        t.setExpectedOutput(tc.getExpectedOutput());
                        t.setHidden(tc.getHidden());
                        return t;
                    })
                    .collect(Collectors.toList());
            dto.setTestCases(tcDtos);
        }

        return dto;
    }
}
