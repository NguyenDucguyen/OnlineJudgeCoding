package com.showtime.onlinejudgecode.auth.repository;

import com.showtime.onlinejudgecode.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
        User findById(String id);
        Optional<User> findByEmail(String email);
        boolean existsByEmail(String email);
        boolean existsByRefCode(String refCode);
}
