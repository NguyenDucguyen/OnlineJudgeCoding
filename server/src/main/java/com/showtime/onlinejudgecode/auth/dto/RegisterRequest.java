package com.showtime.onlinejudgecode.auth.dto;


public class RegisterRequest {

    private String username;
    private String email;
    private String password;
    private String referrerCode;

    public RegisterRequest() {
    }

    public RegisterRequest(String username, String email, String password, String referrerCode) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.referrerCode = referrerCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getReferrerCode() {
        return referrerCode;
    }

    public void setReferrerCode(String referrerCode) {
        this.referrerCode = referrerCode;
    }
}

