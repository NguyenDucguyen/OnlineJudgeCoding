package com.showtime.onlinejudgecode.repository;

import com.showtime.onlinejudgecode.entity.SubmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionResultRepository extends JpaRepository<SubmissionResult, Integer> {

}
