package com.showtime.onlinejudgecode.judge.repository;

import com.showtime.onlinejudgecode.judge.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUser_IdOrderBySubmittedAtDesc(String userId);

    List<Submission> findByProblem_IdOrderBySubmittedAtDesc(Long problemId);

    @Query("SELECT s FROM Submission s JOIN FETCH s.problem p WHERE s.id = :id")
    Optional<Submission> findByIdWithProblem(Long id);

}

