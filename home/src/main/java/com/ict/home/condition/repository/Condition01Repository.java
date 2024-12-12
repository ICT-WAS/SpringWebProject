package com.ict.home.condition.repository;

import com.ict.home.condition.model.Condition01;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Condition01Repository extends JpaRepository<Condition01, Long> {
    Condition01 findByUser_Id(Long Id);
}
