package com.showtime.onlinejudgecode.judge.service;


import com.showtime.onlinejudgecode.auth.entity.User;
import com.showtime.onlinejudgecode.auth.repository.UserRepository;
import com.showtime.onlinejudgecode.judge.dto.request.Judge0Request;
import com.showtime.onlinejudgecode.judge.dto.request.SubmissionRequest;
import com.showtime.onlinejudgecode.judge.dto.response.Judge0Response;
import com.showtime.onlinejudgecode.judge.dto.response.SubmissionHistoryResponse;
import com.showtime.onlinejudgecode.judge.dto.response.SubmissionResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.Submission;
import com.showtime.onlinejudgecode.judge.entity.TestCase;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.repository.SubmissionRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SubmissionService {

    private final Judge0Service judge0Service;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public SubmissionService(Judge0Service judge0Service, SubmissionRepository submissionRepository, ProblemRepository problemRepository, UserRepository userRepository) {
        this.judge0Service = judge0Service;
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Mono<SubmissionResponse> submitCode(SubmissionRequest request, String userId) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        User user = Optional.ofNullable(userId)
                .flatMap(userRepository::findById)
                .orElse(null);

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setSourceCode(request.getSource_code());
        submission.setLanguageId(request.getLanguage_id());
        submission.setStatus("PENDING");
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setTotalTestCases(problem.getTestCases() != null ? problem.getTestCases().size() : 0);
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
        List<TestCase> cases = testCases != null ? testCases : List.of();
        return Flux.fromIterable(cases)
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

        if (submission.getTotalTestCases() != null && submission.getTotalTestCases() > 0) {
            double score = (submission.getPassedTestCases() * 100.0) / submission.getTotalTestCases();
            response.setScore(score);
        } else {
            response.setScore(0.0);
        }

        return response;
    }

    public List<SubmissionHistoryResponse> getUserSubmissions(String userId) {
        return submissionRepository.findByUser_IdOrderBySubmittedAtDesc(userId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    public List<SubmissionHistoryResponse> getProblemSubmissions(Long problemId) {
        return submissionRepository.findByProblem_IdOrderBySubmittedAtDesc(problemId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    public Optional<Submission> getSubmission(Long submissionId) {
        return submissionRepository.findById(submissionId);
    }

    private SubmissionHistoryResponse toHistoryResponse(Submission submission) {
        SubmissionHistoryResponse response = new SubmissionHistoryResponse();
        response.setId(submission.getId());
        if (submission.getProblem() != null) {
            response.setProblemId(submission.getProblem().getId());
            response.setProblemTitle(submission.getProblem().getTitle());
        }
        response.setStatus(submission.getStatus());
        response.setRuntime(submission.getRuntime());
        response.setMemory(submission.getMemory());
        response.setLanguageId(submission.getLanguageId());
        int passed = submission.getPassedTestCases() != null ? submission.getPassedTestCases() : 0;
        int total = submission.getTotalTestCases() != null ? submission.getTotalTestCases() : 0;
        response.setPassedTestCases(passed);
        response.setTotalTestCases(total);
        response.setSubmittedAt(submission.getSubmittedAt());
        double score = total > 0 ? (passed * 100.0) / total : 0.0;
        response.setScore(score);
        response.setOutput(submission.getOutput());
        response.setErrorMessage(submission.getErrorMessage());
        return response;
    }
}
