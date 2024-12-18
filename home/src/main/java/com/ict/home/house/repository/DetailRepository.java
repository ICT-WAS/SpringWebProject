package com.ict.home.house.repository;

import com.ict.home.house.model.Detail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailRepository extends JpaRepository<Detail, Long> {

    List<Detail> findByHouse_HouseId(Long houseId);
}
