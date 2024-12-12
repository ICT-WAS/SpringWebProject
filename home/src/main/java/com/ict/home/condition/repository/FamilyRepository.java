package com.ict.home.condition.repository;

import com.ict.home.condition.model.Family;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    List<Family> findByUser_Id(Long Id);
}
