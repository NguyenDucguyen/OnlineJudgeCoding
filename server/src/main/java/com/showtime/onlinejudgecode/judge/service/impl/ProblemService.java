package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.judge.dto.request.ProblemRequest;
import com.showtime.onlinejudgecode.judge.dto.request.TestCaseRequest;
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

@Service
public class ProblemService implements IProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    /**
     * Lấy danh sách tất cả bài tập.
     * Cache key cố định là 'all' để lưu nguyên list.
     */
    @Override
    @Cacheable(value = "problems_list", key = "'all'")
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    /**
     * Lấy chi tiết 1 bài tập.
     * Sửa key="#a1" thành key="#id" (hoặc #a0).
     */

    @Override
    @Cacheable(value = "problem_detail", key = "#id")
    @Transactional(readOnly = true)
    public Problem getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id " + id));


        if (problem.getTestCases() != null) {
            Hibernate.initialize(problem.getTestCases());


            problem.setTestCases(new ArrayList<>(problem.getTestCases()));
        }

        return problem;
    }
    /**
     * Tạo bài mới:
     * Cần xóa cache danh sách ("problems_list") để bài mới hiện ra trong list.
     */
    @Override
    @Transactional
    @CacheEvict(value = "problems_list", allEntries = true)
    public Problem createProblem(ProblemRequest request) {
        Problem problem = new Problem();
        mapProblemFields(problem, request);
        return problemRepository.save(problem);
    }

    /**
     * Cập nhật bài tập:
     * 1. Xóa cache chi tiết của bài này (problem_detail::id) để lần sau lấy được data mới.
     * 2. Xóa cache danh sách (problems_list) vì title hoặc difficulty có thể đã đổi.
     */
    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "problem_detail", key = "#id"),
            @CacheEvict(value = "problems_list", allEntries = true)
    })
    public Problem updateProblem(Long id, ProblemRequest request) {
        Problem existing = getProblemById(id); // Hàm này có thể lấy từ cache cũ, nhưng không sao vì ta sắp save đè lên

        // Lưu ý: Nếu user sửa Test Case, cần đảm bảo orphanRemoval=true trong Entity Problem
        if (existing.getTestCases() != null) {
            existing.getTestCases().clear();
        }

        mapProblemFields(existing, request);
        return problemRepository.save(existing);
    }

    /**
     * Xóa bài tập:
     * Tương tự Update, cần xóa cả cache chi tiết và cache danh sách.
     */
    @Override
    @Caching(evict = {
            @CacheEvict(value = "problem_detail", key = "#id"),
            @CacheEvict(value = "problems_list", allEntries = true)
    })
    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }

    // --- Helper Methods (Giữ nguyên) ---

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
        // Nếu dùng List, Hibernate có thể cần thay thế list thay vì set mới để tracking
        if (problem.getTestCases() == null) {
            problem.setTestCases(testCases);
        } else {
            problem.getTestCases().addAll(testCases);
        }
    }
}