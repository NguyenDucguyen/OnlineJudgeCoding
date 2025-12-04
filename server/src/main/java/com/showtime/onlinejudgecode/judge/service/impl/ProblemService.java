package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.judge.dto.response.ProblemResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.service.IProblemService;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProblemService implements IProblemService {
    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public List<ProblemResponse> getAllProblems() {
        return problemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProblemResponse> getProblemById(Long id) {
        return problemRepository.findById(id)
                .map(this::mapToResponse);
    }

    private ProblemResponse mapToResponse(Problem problem) {
        return ProblemResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .category(problem.getCategory())
                .constraints(problem.getConstraints())
                .tags(problem.getTags())
                .examples(problem.getExamples())
                .solved(Boolean.TRUE.equals(problem.getSolved()))
                .attempts(problem.getAttempts() == null ? 0 : problem.getAttempts())
                .timeLimit(problem.getTimeLimit())
                .memoryLimit(problem.getMemoryLimit())
                .build();
    }
}
