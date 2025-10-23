package com.showtime.onlinejudgecode.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
@CrossOrigin("*")
public class TestController {

    @GetMapping
     public ResponseEntity<?> getHello() {
         return new ResponseEntity<String>("Hello World", HttpStatus.OK);
     }
}
