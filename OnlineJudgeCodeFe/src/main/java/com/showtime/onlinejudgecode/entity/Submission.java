package com.showtime.onlinejudgecode.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "submission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "code")
    private String code;
    @Column(name = "status")
    private String status;
    @Column(name = "language")
    private String language;
    @Column(name = "score")
    private double score;
    @Column(name = "runtime")
    private double runtime;
    @Column(name = "memory")
    private double memory;
    @Column(name = "createdAt")
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;
}
