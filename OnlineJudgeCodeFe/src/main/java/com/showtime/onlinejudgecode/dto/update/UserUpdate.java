package com.showtime.onlinejudgecode.dto.update;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor

@ToString
public class UserUpdate {

    private String username;
    private String email;
    private String avatar;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatar() {
        return avatar;
    }



}
