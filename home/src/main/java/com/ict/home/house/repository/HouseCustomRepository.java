package com.ict.home.house.repository;

import com.ict.home.house.model.House;

import java.util.List;

public interface HouseCustomRepository {
    // 검색 필터로 조회
    List<House> findFilteredHouseList(List<String> regions,
                                      List<String> houseTypes,
                                      List<String> area,
                                      List<Integer> prices,
                                      List<String> supplies,
                                      List<String> status,
                                      Long userCondition,
                                      String orderBy);
}