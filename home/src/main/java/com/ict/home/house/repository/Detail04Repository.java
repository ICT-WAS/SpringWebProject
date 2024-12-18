package com.ict.home.house.repository;

import com.ict.home.house.model.Detail04;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Detail04Repository extends JpaRepository<Detail04, Long> {

    Optional<Detail04> findByHouse_HouseId(Long houseId);
}
