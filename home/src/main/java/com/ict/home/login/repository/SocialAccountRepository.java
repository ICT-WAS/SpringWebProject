package com.ict.home.login.repository;

import com.ict.home.login.model.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {

    boolean existsByProviderUserId(String providerUserId);
    SocialAccount findByProviderUserId(String providerUserId);
}
