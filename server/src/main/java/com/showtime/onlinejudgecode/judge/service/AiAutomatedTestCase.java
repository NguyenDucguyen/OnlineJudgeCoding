package com.showtime.onlinejudgecode.judge.service;

import com.showtime.onlinejudgecode.judge.dto.ai.ChatCompletionRequest;
import com.showtime.onlinejudgecode.judge.dto.ai.ChatCompletionResponse;
import com.showtime.onlinejudgecode.judge.dto.ai.ChatMessage;
import com.showtime.onlinejudgecode.judge.dto.response.AiFeedbackResponse;
import com.showtime.onlinejudgecode.judge.entity.Problem;
import com.showtime.onlinejudgecode.judge.entity.Submission;
import com.showtime.onlinejudgecode.judge.repository.ProblemRepository;
import com.showtime.onlinejudgecode.judge.repository.SubmissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
public class AiAutomatedTestCase {

    private static final Logger log = LoggerFactory.getLogger(AiFeedbackService.class);

    private final ProblemRepository problemRepository;
    private final WebClient webClient;
    private final String model;
    private final String apiKey;

    public AiAutomatedTestCase(ProblemRepository problemRepository,
                             WebClient.Builder webClientBuilder,
                             @Value("${deepseek.api-key: sk-0d51656c38f14f339c137de30573190f}") String apiKey,
                             @Value("${deepseek.base-url: https://api.deepseek.com}") String baseUrl,
                             @Value("deepseek-chat") String model) {

        this.problemRepository = problemRepository;
        this.model = model;
        this.apiKey = apiKey;

        WebClient.Builder builder = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);


        if (StringUtils.hasText(apiKey)) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey);
        } else {
            log.warn("DeepSeek Api key is empty");
        }

        this.webClient = builder.build();
    }

    public AiFeedbackResponse generateFeedback(Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));


        if (!StringUtils.hasText(apiKey)) {
            log.warn("OpenAI API key is missing. Returning fallback feedback.");
            return buildFallbackResponse(
                    problemId,
                    problem,
                    "Thiếu cấu hình openai.api-key trong application.yml hoặc biến môi trường OPENAI_API_KEY."
            );
        }

        ChatCompletionRequest request = new ChatCompletionRequest();
        request.setModel(model);
        request.setTemperature(0.35);
        request.setMessages(List.of(
                new ChatMessage("system",
                        "Bạn là giảng viên chấm bài lập trình. Trả lời ngắn gọn bằng tiếng Việt, tránh đưa full code giải."),
                new ChatMessage("user", buildPrompt(submission))
        ));

        ChatCompletionResponse response;
        try {
            response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ChatCompletionResponse.class)
                    .timeout(Duration.ofSeconds(60))
                    .onErrorResume(ex -> {
                        log.error("Không gọi được OpenAI", ex);
                        return Mono.error(new RuntimeException("Không thể lấy phản hồi từ GPT-4o"));
                    })
                    .block();
        } catch (Exception ex) {
            log.error("AI feedback generation failed, returning fallback response", ex);
            return buildFallbackResponse(
                    submissionId,
                    submission,
                    "Không thể lấy phản hồi từ GPT-4o: " + ex.getMessage()
            );
        }

        String content = null;
        if (response != null) {
            content = response.getFirstMessageContent();
        }
        if (!StringUtils.hasText(content)) {
            content = "Không nhận được phản hồi từ GPT-4o.";
        }

        return buildResponse(submissionId, submission, content);
    }

    private AiFeedbackResponse buildResponse(Long submissionId, Submission submission, String feedbackContent) {
        AiFeedbackResponse feedbackResponse = new AiFeedbackResponse();
        feedbackResponse.setSubmissionId(submissionId);
        feedbackResponse.setProblemTitle(
                submission.getProblem() != null ? submission.getProblem().getTitle() : null
        );
        feedbackResponse.setStatus(submission.getStatus());
        feedbackResponse.setModel(model);
        feedbackResponse.setFeedback(feedbackContent);
        return feedbackResponse;
    }

    private AiFeedbackResponse buildFallbackResponse(Long submissionId, Submission submission, String reason) {
        StringBuilder builder = new StringBuilder();
        builder.append(reason).append("\n");
        builder.append("Trạng thái bài: ").append(submission.getStatus()).append(". ");
        builder.append("Passed ")
                .append(submission.getPassedTestCases() != null ? submission.getPassedTestCases() : 0)
                .append("/")
                .append(submission.getTotalTestCases() != null ? submission.getTotalTestCases() : 0)
                .append(" test.\n");

        if (StringUtils.hasText(submission.getErrorMessage())) {
            builder.append("Thông báo lỗi gần nhất: ").append(submission.getErrorMessage()).append("\n");
        } else if (StringUtils.hasText(submission.getOutput())) {
            builder.append("Output gần nhất: ").append(submission.getOutput()).append("\n");
        }

        builder.append("Vui lòng cấu hình OpenAI API key hoặc thử lại sau.");

        return buildResponse(submissionId, submission, builder.toString());
    }

    private String buildPrompt(Submission submission) {
        StringBuilder prompt = new StringBuilder();
        Problem problem = submission.getProblem();

        if (problem != null) {
            prompt.append("Bài toán: ").append(problem.getTitle())
                    .append(" (độ khó: ")
                    .append(problem.getDifficulty())
                    .append(")\n");

            if (problem.getDescription() != null) {
                String desc = problem.getDescription();
                if (desc.length() > 900) {
                    desc = desc.substring(0, 900) + "...";
                }
                prompt.append("Mô tả rút gọn:\n")
                        .append(desc)
                        .append("\n\n");
            }
        }

        prompt.append("Trạng thái chấm: ").append(submission.getStatus())
                .append(". Passed ")
                .append(submission.getPassedTestCases() != null ? submission.getPassedTestCases() : 0)
                .append("/")
                .append(submission.getTotalTestCases() != null ? submission.getTotalTestCases() : 0)
                .append(" test.\n");

        if (submission.getRuntime() != null) {
            prompt.append("Runtime trung bình: ").append(submission.getRuntime()).append("ms.\n");
        }

        if (StringUtils.hasText(submission.getErrorMessage())) {
            prompt.append("Thông báo lỗi/compile hoặc stderr:\n")
                    .append(submission.getErrorMessage())
                    .append("\n");
        }

        if (StringUtils.hasText(submission.getOutput())) {
            prompt.append("Output gần nhất:\n")
                    .append(submission.getOutput())
                    .append("\n");
        }

        prompt.append("Mã nguồn:")
                .append("\n``````\n")
                .append(submission.getSourceCode())
                .append("\n``````\n");

        prompt.append("Hãy: (1) Giải thích lý do bài không đạt (hoặc điểm mạnh nếu Accepted). ")
                .append("(2) Đưa 2-3 gợi ý chi tiết để cải thiện hoặc sửa lỗi. ")
                .append("(3) Không cung cấp đáp án hoàn chỉnh, chỉ hướng đi.");

        return prompt.toString();
    }
}
