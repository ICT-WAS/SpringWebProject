package com.ict.home.interest.repository;

import com.ict.home.interest.model.Interest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterestRepository extends JpaRepository<Interest, Long> {
    List<Interest> findByUser_Id(Long userId);

    Interest findByUser_IdAndHouse_houseId(Long userId, Long houseId);
}
