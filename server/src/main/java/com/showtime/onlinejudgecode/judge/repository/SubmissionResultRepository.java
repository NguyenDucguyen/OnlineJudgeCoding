//package com.showtime.onlinejudgecode.judge.repository;
//
//import com.showtime.onlinejudgecode.judge.entity.SubmissionResult;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface SubmissionResultRepository extends JpaRepository<SubmissionResult, Integer> {
//    List<SubmissionResult> findBySubmissionId(int submissionId);
//    List<SubmissionResult> findByTestCaseId(int testCaseId);
//    long countBySubmissionIdAndSuccessTrue(int submissionId);
//}
