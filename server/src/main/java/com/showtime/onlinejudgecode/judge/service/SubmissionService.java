package com.showtime.onlinejudgecode.judge.service;


import com.showtime.onlinejudgecode.auth.entity.User;
import com.showtime.onlinejudgecode.auth.repository.UserRepository;
import com.showtime.onlinejudgecode.judge.dto.request.Judge0Request;
import com.showtime.onlinejudgecode.judge.dto.request.SubmissionRequest;
import com.showtime.onlinejudgecode.judge.dto.response.Judge0Response;
import com.showtime.onlinejudgecode.judge.dto.response.SubmissionResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.Submission;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.repository.SubmissionRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SubmissionService {

    private final Judge0Service judge0Service;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final Set<Integer> allowedLanguageIds;
    private final int maxSourceSizeBytes;

    public SubmissionService(Judge0Service judge0Service,
                             SubmissionRepository submissionRepository,
                             ProblemRepository problemRepository,
                             UserRepository userRepository,
                             @Value("${judge0.allowed-language-ids:52,62,71}") List<Integer> allowedLanguageIds,
                             @Value("${judge0.max-source-size-bytes:65536}") int maxSourceSizeBytes) {
        this.judge0Service = judge0Service;
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.allowedLanguageIds = allowedLanguageIds.stream().collect(Collectors.toSet());
        this.maxSourceSizeBytes = maxSourceSizeBytes;
    }

    @Transactional
    public Mono<SubmissionResponse> submitCode(SubmissionRequest request, String userId) {
        validateSubmissionRequest(request);
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        User user = userRepository.findById(userId);

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setSourceCode(request.getSource_code());
        submission.setLanguageId(request.getLanguage_id());
        submission.setStatus("PENDING");
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setTotalTestCases(problem.getTestCases().size());
        submission.setPassedTestCases(0);

        submission = submissionRepository.save(submission);
        final Submission finalSubmission = submission;

        return runTestCases(problem.getTestCases(), request, problem)
                .collectList()
                .map(results -> {
                    long passed = results.stream().filter(r -> r.getStatus().getId() == 3).count();
                    finalSubmission.setPassedTestCases((int) passed);
                    finalSubmission.setStatus(passed == results.size() ? "ACCEPTED" : "WRONG_ANSWER");

                    results.stream()
                            .filter(r -> r.getStatus().getId() != 3)
                            .findFirst()
                            .ifPresent(failed -> {
                                finalSubmission.setOutput(failed.getStdout());
                                finalSubmission.setErrorMessage(
                                        failed.getStderr() != null ? failed.getStderr() : failed.getCompile_output()
                                );
                            });

                    double avgTime = results.stream().mapToDouble(Judge0Response::getTime).average().orElse(0.0);
                    finalSubmission.setRuntime((int) (avgTime * 1000));
                    submissionRepository.save(finalSubmission);

                    return buildResponse(finalSubmission);
                })
                .onErrorMap(ex -> {
                    // Cập nhật trạng thái khi Judge0 lỗi (đừng nuốt lỗi)
                    finalSubmission.setStatus("JUDGE0_ERROR");
                    finalSubmission.setErrorMessage(ex.getMessage());
                    submissionRepository.save(finalSubmission);
                    return ex; // đẩy lỗi ra cho controller map đúng status
                });
    }


    private Flux<Judge0Response> runTestCases(List<TestCase> testCases,
                                              SubmissionRequest request,
                                              Problem problem) {
        return Flux.fromIterable(testCases)
                .flatMap(testCase -> {
                    Judge0Request judge0Request = new Judge0Request();
                    judge0Request.setSource_code(request.getSource_code());
                    judge0Request.setLanguage_id(request.getLanguage_id());
                    judge0Request.setStdin(testCase.getInput());
                    judge0Request.setExpected_output(testCase.getExpectedOutput());


                    return judge0Service.submitCode(judge0Request)
                            .flatMap(token -> judge0Service.waitForResult(token, 10));
                });
    }

    private SubmissionResponse buildResponse(Submission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setSubmissionId(submission.getId());
        response.setStatus(submission.getStatus());
        response.setRuntime(submission.getRuntime());
        response.setMemory(submission.getMemory());
        response.setOutput(submission.getOutput());
        response.setErrorMessage(submission.getErrorMessage());
        response.setPassedTestCases(submission.getPassedTestCases());
        response.setTotalTestCases(submission.getTotalTestCases());

        double score = (submission.getPassedTestCases() * 100.0) / submission.getTotalTestCases();
        response.setScore(score);

        return response;
    }

    public List<Submission> getUserSubmissions(String userId) {
        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
    }

    public List<Submission> getProblemSubmissions(Long problemId) {
        return submissionRepository.findByProblemIdOrderBySubmittedAtDesc(problemId);
    }

    private void validateSubmissionRequest(SubmissionRequest request) {
        if (request.getLanguage_id() == null || !allowedLanguageIds.contains(request.getLanguage_id())) {
            throw new IllegalArgumentException("Unsupported language_id: " + request.getLanguage_id());
        }

        String sourceCode = request.getSource_code();
        if (sourceCode == null || sourceCode.isBlank()) {
            throw new IllegalArgumentException("Source code must not be empty");
        }

        int sourceSize = sourceCode.getBytes(StandardCharsets.UTF_8).length;
        if (sourceSize > maxSourceSizeBytes) {
            throw new IllegalArgumentException("Source code exceeds max size of " + maxSourceSizeBytes + " bytes");
        }
    }
}
