package com.showtime.onlinejudgecode.repository;

import com.showtime.onlinejudgecode.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Integer> {

}
