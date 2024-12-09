package com.ict.home.login.auth.repository;

import com.ict.home.login.auth.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Optional<Verification> findByVerificationCode(String verificationCode);

    Optional<Verification> findByEmail(String email);

    Optional<Verification> findByPhoneNumber(String phoneNumber);
}
