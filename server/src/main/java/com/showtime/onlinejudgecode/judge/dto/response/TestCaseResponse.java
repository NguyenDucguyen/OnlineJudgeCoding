package com.showtime.onlinejudgecode.judge.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TestCaseResponse {
    private Long id;
    private String input;
    private String expectedOutput;
    private boolean hidden;
}
