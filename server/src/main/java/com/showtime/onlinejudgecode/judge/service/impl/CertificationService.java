package com.showtime.onlinejudgecode.judge.service.impl;

import com.showtime.onlinejudgecode.auth.service.RefCodeGenerator;
import com.showtime.onlinejudgecode.judge.dto.request.CertificateAwardRequest;
import com.showtime.onlinejudgecode.judge.dto.request.CertificationRequest;
import com.showtime.onlinejudgecode.judge.entity.CertificateAward;
import com.showtime.onlinejudgecode.judge.entity.Certification;
import com.showtime.onlinejudgecode.judge.repository.CertificateAwardRepository;
import com.showtime.onlinejudgecode.judge.repository.CertificationRepository;
import com.showtime.onlinejudgecode.judge.service.ICertificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CertificationService implements ICertificationService {

    private final CertificationRepository certificationRepository;
    private final CertificateAwardRepository certificateAwardRepository;

    public CertificationService(CertificationRepository certificationRepository,
                                CertificateAwardRepository certificateAwardRepository) {
        this.certificationRepository = certificationRepository;
        this.certificateAwardRepository = certificateAwardRepository;
    }

    @Override
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    @Override
    public Certification getCertification(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certification not found with id " + id));
    }

    @Override
    public Certification createCertification(CertificationRequest request) {
        Certification certification = new Certification();
        mapCertificationFields(certification, request);
        return certificationRepository.save(certification);
    }

    @Override
    public Certification updateCertification(Long id, CertificationRequest request) {
        Certification existing = getCertification(id);
        mapCertificationFields(existing, request);
        return certificationRepository.save(existing);
    }

    @Override
    public void deleteCertification(Long id) {
        certificationRepository.deleteById(id);
    }

    @Override
    public CertificateAward awardCertificate(Long certificationId, CertificateAwardRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("User id is required to award a certificate");
        }
        Certification certification = getCertification(certificationId);

        CertificateAward award = new CertificateAward();
        award.setCertification(certification);
        award.setUserId(request.getUserId());
        award.setScore(request.getScore());

        Double passingScore = certification.getPassingScore() != null ? certification.getPassingScore() : 0.0;
        Double score = request.getScore() != null ? request.getScore() : 0.0;
        award.setPassed(score >= passingScore);
        award.setIssuedAt(LocalDateTime.now());
        award.setVerificationCode(RefCodeGenerator.generateRefCode(10));

        return certificateAwardRepository.save(award);
    }

    @Override
    public List<CertificateAward> getAwardsForCertification(Long certificationId) {
        getCertification(certificationId);
        return certificateAwardRepository.findByCertificationId(certificationId);
    }

    private void mapCertificationFields(Certification certification, CertificationRequest request) {
        certification.setTitle(request.getTitle());
        certification.setDescription(request.getDescription());
        certification.setDurationMinutes(request.getDurationMinutes());
        certification.setQuestionCount(request.getQuestionCount());
        certification.setParticipantCount(request.getParticipantCount());
        certification.setDifficulty(request.getDifficulty());
        certification.setPassingScore(request.getPassingScore());
    }
}
