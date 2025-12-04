package com.showtime.onlinejudgecode.judge.controller;

import com.showtime.onlinejudgecode.judge.dto.request.CertificateAwardRequest;
import com.showtime.onlinejudgecode.judge.dto.request.CertificationRequest;
import com.showtime.onlinejudgecode.judge.entity.CertificateAward;
import com.showtime.onlinejudgecode.judge.entity.Certification;
import com.showtime.onlinejudgecode.judge.service.impl.CertificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    @GetMapping
    public ResponseEntity<List<Certification>> getAllCertifications() {
        return ResponseEntity.ok(certificationService.getAllCertifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certification> getCertification(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(certificationService.getCertification(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Certification> createCertification(@RequestBody CertificationRequest request) {
        Certification saved = certificationService.createCertification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certification> updateCertification(@PathVariable Long id, @RequestBody CertificationRequest request) {
        try {
            Certification updated = certificationService.updateCertification(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        certificationService.deleteCertification(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/award")
    public ResponseEntity<CertificateAward> awardCertificate(@PathVariable Long id,
                                                             @RequestBody CertificateAwardRequest request) {
        try {
            CertificateAward award = certificationService.awardCertificate(id, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(award);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/awards")
    public ResponseEntity<List<CertificateAward>> getAwards(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(certificationService.getAwardsForCertification(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
