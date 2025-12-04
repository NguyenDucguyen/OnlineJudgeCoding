package com.showtime.onlinejudgecode.judge.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Example {
    private String input;
    private String output;
    private String explanation;

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
