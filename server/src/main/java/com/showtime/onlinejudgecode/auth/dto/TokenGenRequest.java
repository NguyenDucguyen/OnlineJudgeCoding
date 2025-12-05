package com.showtime.onlinejudgecode.auth.dto;

import com.showtime.onlinejudgecode.auth.entity.Role;

public class TokenGenRequest {

    private String email;

    private Role role;

    public TokenGenRequest() {}

    public TokenGenRequest(String email, Role role) {
        this.email = email;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}