package com.ict.home.house.repository;

import com.ict.home.condition.model.Account;
import com.ict.home.condition.model.Condition01;
import com.ict.home.condition.model.Condition03;
import com.ict.home.condition.model.Family;
import com.ict.home.house.model.House;

import java.util.List;

public interface HouseCustomRepository {
    // 검색 필터로 조회
    List<House> findFilteredHouseList(List<String> regions,
                                      List<String> houseTypes,
                                      List<String> area,
                                      List<Integer> prices,
                                      List<String> supplies,
                                      List<String> statuses,
                                      List<Account> accounts,
                                      Condition01 condition01,
                                      Condition03 condition03,
                                      List<Family> families,
                                      String orderBy);

    List<House> findByName(String keyword);

    House findById(Long houseId);
}