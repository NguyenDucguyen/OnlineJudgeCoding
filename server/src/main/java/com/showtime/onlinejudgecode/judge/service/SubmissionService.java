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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
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
    @Caching(evict = {
            @CacheEvict(value = "user_submissions", key = "#a1", condition = "#a1 != null"),
            @CacheEvict(value = "problem_submissions", key = "#a0.problemId")
    })
    public Mono<SubmissionResponse> submitCode(SubmissionRequest request, String userId) {
        return Mono.fromCallable(() -> {

                    Problem problem = problemRepository.findByIdWithTestCases(request.getProblemId())
                            .orElseThrow(() -> new RuntimeException("Problem not found"));


                    User user = null;
                    if (userId != null) {
                        user = userRepository.findById(userId).orElse(null);
                    }

                    Submission submission = new Submission();
                    submission.setUser(user);
                    submission.setProblem(problem);
                    submission.setSourceCode(request.getSource_code());
                    submission.setLanguageId(request.getLanguage_id());
                    submission.setStatus("PENDING");
                    submission.setSubmittedAt(LocalDateTime.now());

                    submission.setTotalTestCases(problem.getTestCases() != null ? problem.getTestCases().size() : 0);
                    submission.setPassedTestCases(0);

                    return submissionRepository.save(submission);
                })
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(savedSubmission -> {

                    Problem problem = savedSubmission.getProblem();


                    return runTestCases(problem.getTestCases(), request, problem)
                            .collectList()
                            .flatMap(results -> Mono.fromCallable(() -> {
                                // Bảo vệ null khi Judge0 trả về trạng thái không hợp lệ
                                long passed = results.stream().filter(this::isAccepted).count();
                                savedSubmission.setPassedTestCases((int) passed);

                                boolean allPassed = !results.isEmpty() && passed == results.size();
                                savedSubmission.setStatus(allPassed ? "ACCEPTED" : "WRONG_ANSWER");

                                results.stream()
                                        .filter(resp -> !isAccepted(resp))
                                        .findFirst()
                                        .ifPresent(failed -> {
                                            String decodedStdout = decodeBase64(failed.getStdout());
                                            String decodedError = decodeBase64(
                                                    failed.getStderr() != null ? failed.getStderr() : failed.getCompile_output());
                                            savedSubmission.setOutput(decodedStdout);
                                            savedSubmission.setErrorMessage(decodedError);
                                        });

                                double avgTime = results.stream()
                                        .mapToDouble(resp -> resp.getTime() != null ? resp.getTime() : 0.0)
                                        .average()
                                        .orElse(0.0);
                                savedSubmission.setRuntime((int) (avgTime * 1000));

                                submissionRepository.save(savedSubmission);
                                return buildResponse(savedSubmission);
                            }).subscribeOn(Schedulers.boundedElastic()));
                })
                .onErrorResume(ex -> Mono.error(ex));
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


    @Cacheable(value = "submission_user", key = "#userId")
    public List<SubmissionHistoryResponse> getUserSubmissions(String userId) {
        log.info("Fetching submissions for user {} from Database", userId);
        return submissionRepository.findByUser_IdOrderBySubmittedAtDesc(userId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }


    @Cacheable(value = "submission_problem", key = "#problemId")
    public List<SubmissionHistoryResponse> getProblemSubmissions(Long problemId) {
        log.info("Fetching submissions for problem {} from Database", problemId);
        return submissionRepository.findByProblem_IdOrderBySubmittedAtDesc(problemId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }


    public Optional<Submission> getSubmission(Long submissionId) {
        return submissionRepository.findById(submissionId);
    }


    private String decodeBase64(String encodedString) {
        if (encodedString == null) return null;
        try {

            byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return encodedString;
        }
    }

    private boolean isAccepted(Judge0Response response) {
        Integer statusId = getStatusId(response);
        return statusId != null && statusId == 3;
    }

    private Integer getStatusId(Judge0Response response) {
        if (response == null || response.getStatus() == null) {
            return null;
        }
        return response.getStatus().getId();
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