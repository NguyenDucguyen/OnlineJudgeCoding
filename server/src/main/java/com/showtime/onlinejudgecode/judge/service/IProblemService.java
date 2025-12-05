package com.showtime.onlinejudgecode.judge.service;

import com.showtime.onlinejudgecode.judge.dto.request.ProblemRequest;
import com.showtime.onlinejudgecode.judge.dto.response.ProblemResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;

import java.util.List;

public interface IProblemService {
    List<ProblemResponse> getAllProblems();
    ProblemResponse getProblemById(Long id);
    Problem createProblem(ProblemRequest request);
    Problem updateProblem(Long id, ProblemRequest request);
    void deleteProblem(Long id);
}
