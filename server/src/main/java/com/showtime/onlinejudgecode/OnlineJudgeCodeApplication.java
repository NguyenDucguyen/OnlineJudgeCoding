package com.showtime.onlinejudgecode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class OnlineJudgeCodeApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineJudgeCodeApplication.class, args);
    }

}
