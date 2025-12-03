package com.showtime.onlinejudgecode.judge.repository;

import com.showtime.onlinejudgecode.judge.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUserIdOrderBySubmittedAtDesc(String userId);

    List<Submission> findByProblemIdOrderBySubmittedAtDesc(Long problemId);


}

