package com.showtime.onlinejudgecode.judge.repository;

import com.showtime.onlinejudgecode.judge.entity.CertificateAward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateAwardRepository extends JpaRepository<CertificateAward, Long> {
    List<CertificateAward> findByCertificationId(Long certificationId);
}
