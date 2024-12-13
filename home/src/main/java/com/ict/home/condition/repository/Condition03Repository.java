package com.ict.home.condition.repository;

import com.ict.home.condition.model.Condition03;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Condition03Repository extends JpaRepository<Condition03, Long> {
    Condition03 findByUser_Id(Long Id);
}
