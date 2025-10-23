package com.showtime.onlinejudgecode.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "submission_result")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SubmissionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "runtime", nullable = false)
    private double runtime;
    @Column(name = "memory" , nullable = false)
    private double memory;
    @Column(name = "success", nullable = false)
    private boolean success;

    @ManyToOne
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestCase testCase;

    @Override
    public String toString() {
        return "SubmissionResult{" +
                "id=" + id +
                ", runtime=" + runtime +
                ", memory=" + memory +
                ", success=" + success +
                ", submission=" + submission +
                ", testCase=" + testCase +
                '}';
    }
}
