package com.showtime.onlinejudgecode.judge.repository;

import com.showtime.onlinejudgecode.judge.entity.ContestRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContestRegistrationRepository extends JpaRepository<ContestRegistration, Long> {
    boolean existsByContestIdAndUserId(Long contestId, String userId);
    long countByContestId(Long contestId);
    List<ContestRegistration> findByContestId(Long contestId);
}
