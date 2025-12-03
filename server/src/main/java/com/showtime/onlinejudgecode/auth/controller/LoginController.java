//package com.showtime.onlinejudgecode.auth.controller;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//@RestController
//@RequestMapping("/api/v1")
//public class LoginController {
//
//    @Value("${spring.security.user.name}")
//    private String appUsername;
//
//    @Value("${spring.security.user.password}")
//    private String appPassword;
//
//    @GetMapping("/login")
//    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
//        if (appUsername.equals(username) && appPassword.equals(password)) {
//            return ResponseEntity.ok("Đăng nhập thành công!");
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu");
//        }
//    }
//}

