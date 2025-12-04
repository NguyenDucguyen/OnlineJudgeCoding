package com.showtime.onlinejudgecode.judge.service;

import com.showtime.onlinejudgecode.judge.dto.request.CertificateAwardRequest;
import com.showtime.onlinejudgecode.judge.dto.request.CertificationRequest;
import com.showtime.onlinejudgecode.judge.entity.CertificateAward;
import com.showtime.onlinejudgecode.judge.entity.Certification;

import java.util.List;

public interface ICertificationService {
    List<Certification> getAllCertifications();
    Certification getCertification(Long id);
    Certification createCertification(CertificationRequest request);
    Certification updateCertification(Long id, CertificationRequest request);
    void deleteCertification(Long id);
    CertificateAward awardCertificate(Long certificationId, CertificateAwardRequest request);
    List<CertificateAward> getAwardsForCertification(Long certificationId);
}
