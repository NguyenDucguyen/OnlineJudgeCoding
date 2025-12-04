package com.showtime.onlinejudgecode.judge.service;

import com.showtime.onlinejudgecode.judge.dto.response.ProblemResponse;

import java.util.List;
import java.util.Optional;

public interface IProblemService {
    List<ProblemResponse> getAllProblems();
    Optional<ProblemResponse> getProblemById(Long id);
}
