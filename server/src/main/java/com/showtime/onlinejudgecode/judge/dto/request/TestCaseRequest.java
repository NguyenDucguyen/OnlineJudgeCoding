package com.showtime.onlinejudgecode.judge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseRequest {
    @NotBlank
    private String input;

    @NotBlank
    private String expectedOutput;

    @NotNull
    private Boolean hidden;
}
