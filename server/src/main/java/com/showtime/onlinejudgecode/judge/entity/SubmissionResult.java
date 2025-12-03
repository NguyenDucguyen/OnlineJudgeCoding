//package com.showtime.onlinejudgecode.judge.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Entity
//@Table(name = "submission_results")
//public class SubmissionResult {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id;
//
//    @Column(name = "runtime", nullable = false)
//    private double runtime;
//
//    @Column(name = "memory", nullable = false)
//    private double memory;
//
//    @Column(name = "success", nullable = false)
//    private boolean success;
//
//    @ManyToOne
//    @JoinColumn(name = "submission_id")
//    private Submission submission;
//
//    @ManyToOne
//    @JoinColumn(name = "test_id")
//    private TestCase testCase;
//
//    // THÊM MỚI: Chi tiết kết quả
//    @Column(name = "status")
//    private String status; // ACCEPTED, WRONG_ANSWER, TIME_LIMIT, etc.
//
//    @Column(name = "stdout", columnDefinition = "TEXT")
//    private String stdout; // Output thực tế
//
//    @Column(name = "stderr", columnDefinition = "TEXT")
//    private String stderr; // Error output
//
//    @Column(name = "judge0_token")
//    private String judge0Token; // Token từ Judge0 để tracking
//
//    public int getId() {
//        return id;
//    }
//
//    public void setId(int id) {
//        this.id = id;
//    }
//
//    public double getRuntime() {
//        return runtime;
//    }
//
//    public void setRuntime(double runtime) {
//        this.runtime = runtime;
//    }
//
//    public double getMemory() {
//        return memory;
//    }
//
//    public void setMemory(double memory) {
//        this.memory = memory;
//    }
//
//    public boolean isSuccess() {
//        return success;
//    }
//
//    public void setSuccess(boolean success) {
//        this.success = success;
//    }
//
//    public Submission getSubmission() {
//        return submission;
//    }
//
//    public void setSubmission(Submission submission) {
//        this.submission = submission;
//    }
//
//    public TestCase getTestCase() {
//        return testCase;
//    }
//
//    public void setTestCase(TestCase testCase) {
//        this.testCase = testCase;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public String getStdout() {
//        return stdout;
//    }
//
//    public void setStdout(String stdout) {
//        this.stdout = stdout;
//    }
//
//    public String getStderr() {
//        return stderr;
//    }
//
//    public void setStderr(String stderr) {
//        this.stderr = stderr;
//    }
//
//    public String getJudge0Token() {
//        return judge0Token;
//    }
//
//    public void setJudge0Token(String judge0Token) {
//        this.judge0Token = judge0Token;
//    }
//}
