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

    // ... (Khai báo biến và Constructor giữ nguyên)
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

    /**
     * Khi nộp code (GHI): Cần xóa cache cũ để danh sách hiển thị mới nhất.
     * 1. Xóa cache lịch sử của User này (submission_user).
     * 2. Xóa cache lịch sử của Problem này (submission_problem).
     */
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "user_submissions", key = "#a1", condition = "#a1 != null"),
            @CacheEvict(value = "problem_submissions", key = "#a0.problemId")
    })
    public Mono<SubmissionResponse> submitCode(SubmissionRequest request, String userId) {
        return Mono.fromCallable(() -> {
                    // --- SỬA DÒNG NÀY ---
                    // Thay problemRepository.findById(...) bằng findByIdWithTestCases(...)
                    Problem problem = problemRepository.findByIdWithTestCases(request.getProblemId())
                            .orElseThrow(() -> new RuntimeException("Problem not found"));
                    // --------------------

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

                    // Lúc này getTestCases() đã có dữ liệu, không bị lỗi no Session nữa
                    submission.setTotalTestCases(problem.getTestCases() != null ? problem.getTestCases().size() : 0);
                    submission.setPassedTestCases(0);

                    return submissionRepository.save(submission);
                })
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(savedSubmission -> {
                    // Lấy problem từ submission đã lưu
                    Problem problem = savedSubmission.getProblem();

                    // Quan trọng: Vì testCases đã fetch ở bước 1, nên ở đây dùng bình thường
                    return runTestCases(problem.getTestCases(), request, problem)
                            .collectList()
                            .flatMap(results -> {
                                // ... (Code xử lý kết quả giữ nguyên như cũ) ...
                                return Mono.fromCallable(() -> {
                                    // ... logic update submission ...
                                    long passed = results.stream().filter(r -> r.getStatus().getId() == 3).count();
                                    savedSubmission.setPassedTestCases((int) passed);
                                    savedSubmission.setStatus(passed == results.size() ? "ACCEPTED" : "WRONG_ANSWER");

                                    // Logic decodeBase64 bạn vừa thêm
                                    results.stream()
                                            .filter(r -> r.getStatus().getId() != 3)
                                            .findFirst()
                                            .ifPresent(failed -> {
                                                String decodedStdout = decodeBase64(failed.getStdout());
                                                String decodedError = decodeBase64(failed.getStderr() != null ? failed.getStderr() : failed.getCompile_output());
                                                savedSubmission.setOutput(decodedStdout);
                                                savedSubmission.setErrorMessage(decodedError);
                                            });

                                    double avgTime = results.stream().mapToDouble(Judge0Response::getTime).average().orElse(0.0);
                                    savedSubmission.setRuntime((int) (avgTime * 1000));

                                    submissionRepository.save(savedSubmission);
                                    return buildResponse(savedSubmission);
                                }).subscribeOn(Schedulers.boundedElastic());
                            });
                })
                .onErrorResume(ex -> Mono.error(ex));
    }

    // ... (runTestCases và buildResponse giữ nguyên)
    private Flux<Judge0Response> runTestCases(List<TestCase> testCases,
                                              SubmissionRequest request,
                                              Problem problem) {
        // ... (Giữ nguyên logic cũ)
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
        // ... (Giữ nguyên logic cũ)
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

    /**
     * Lấy danh sách submission của User (ĐỌC): Cache lại.
     * Key cache: submission_user::<userId>
     */
    @Cacheable(value = "submission_user", key = "#userId")
    public List<SubmissionHistoryResponse> getUserSubmissions(String userId) {
        log.info("Fetching submissions for user {} from Database", userId);
        return submissionRepository.findByUser_IdOrderBySubmittedAtDesc(userId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    /**
     * Lấy danh sách submission của Problem (ĐỌC): Cache lại.
     * Key cache: submission_problem::<problemId>
     */
    @Cacheable(value = "submission_problem", key = "#problemId")
    public List<SubmissionHistoryResponse> getProblemSubmissions(Long problemId) {
        log.info("Fetching submissions for problem {} from Database", problemId);
        return submissionRepository.findByProblem_IdOrderBySubmittedAtDesc(problemId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    // Không nên cache getSubmission chi tiết (byId) nếu trạng thái thay đổi liên tục
    // từ PENDING -> ACCEPTED trong thời gian ngắn.
    public Optional<Submission> getSubmission(Long submissionId) {
        return submissionRepository.findById(submissionId);
    }

    // --- THÊM HÀM TIỆN ÍCH NÀY ---
    private String decodeBase64(String encodedString) {
        if (encodedString == null) return null;
        try {
            // Kiểm tra xem chuỗi có phải Base64 hợp lệ không, nếu không trả về nguyên gốc
            byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return encodedString; // Trả về text gốc nếu Judge0 không gửi về base64
        }
    }
    // ... (toHistoryResponse giữ nguyên)
    private SubmissionHistoryResponse toHistoryResponse(Submission submission) {
        // ... (Giữ nguyên logic cũ)
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