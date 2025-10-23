package com.showtime.onlinejudgecode.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "test_case")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "input")
    private String input;
    @Column(name = "expected_output")
    private String expectedOutput;
    @Column(name = "is_sample")
    private boolean isSample;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @Override
    public String toString() {
        return "TestCase{" +
                "id=" + id +
                ", input='" + input + '\'' +
                ", expectedOutput='" + expectedOutput + '\'' +
                ", isSample=" + isSample +
                ", problem=" + problem +
                '}';
    }
}
