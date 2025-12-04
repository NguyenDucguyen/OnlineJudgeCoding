package com.showtime.onlinejudgecode.judge.dto.request;

public class CertificateAwardRequest {
    private String userId;
    private Double score;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}
