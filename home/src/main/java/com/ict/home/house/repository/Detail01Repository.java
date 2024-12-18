package com.ict.home.house.repository;

import com.ict.home.house.model.Detail01;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Detail01Repository extends JpaRepository<Detail01, Long> {

    Optional<Detail01> findByHouse_HouseId(Long houseId);
}
