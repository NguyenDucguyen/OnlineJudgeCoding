package com.showtime.onlinejudgecode.judge.dto.response;

import com.showtime.onlinejudgecode.judge.entity.Example;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ProblemResponse {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String category;
    private List<Example> examples;
    private List<String> constraints;
    private List<String> tags;
    private boolean solved;
    private Integer attempts;
    private Integer timeLimit;
    private Integer memoryLimit;
}
