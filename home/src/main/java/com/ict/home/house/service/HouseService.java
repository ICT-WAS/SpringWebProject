package com.ict.home.house.service;

import com.ict.home.house.dto.HouseInfo;

import java.util.List;

public interface HouseService {

    List<HouseInfo> getHouseInfoList();

    List<HouseInfo> filterByRegions(List<HouseInfo> houseInfoList, List<String> regions);
}
