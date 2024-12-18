package com.ict.home.login.repository;

import com.ict.home.login.model.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {

    boolean existsByProviderUserId(String providerUserId);
    SocialAccount findByProviderUserId(String providerUserId);
    @Query("SELECT s.provider FROM SocialAccount s WHERE s.user.Id = :userId")
    List<String> findProvidersByUserId(@Param("userId")Long userId);
}
