package com.ict.home.login.auth.repository;

import com.ict.home.login.auth.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Optional<Verification> findByVerificationCode(String verificationCode);

    Optional<Verification> findByEmail(String email);

    Optional<Verification> findByPhoneNumber(String phoneNumber);

    Optional<Verification> findByPhoneNumberAndVerificationCode(String phoneNumber, String verificationCode);

    Optional<Verification> findByEmailAndVerificationCode(String email, String verificationCode);


}
