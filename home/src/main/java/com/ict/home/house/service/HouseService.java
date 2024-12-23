package com.ict.home.house.service;

import com.ict.home.house.dto.HouseDetailDTO;
import com.ict.home.house.dto.HouseInfo;
import com.ict.home.house.model.House;

import java.util.List;
import java.util.Map;

public interface HouseService {

    List<HouseInfo> getHouseInfoListByFilter(List<String> regions,
                                             List<String> houseTypes,
                                             List<String> area,
                                             List<Integer> prices,
                                             List<String> supplies,
                                             List<String> statuses,
                                             Long userId,
                                             String orderBy);

    List<HouseInfo> getHouseInfoListByName(String keyword);

    HouseDetailDTO getHouseDetail(Long houseId);

    List<HouseInfo> getHouseInfoByInterest(List<House> houses);

    Map<String, List<String>> getSolution(Long houseId, Long userId, String type);
}
