package com.ict.home.condition.repository;

import com.ict.home.condition.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser_Id(Long Id);
}
