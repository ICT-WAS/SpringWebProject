package com.ict.home.interest.service;

import com.ict.home.interest.model.Interest;

import java.util.List;

public interface InterestService {

    Interest createInterest(Long userId, Long houseId);

    boolean deleteInterest(Long interestId);

    List<Interest> readInterest(Long userId);

    Long getInterestIdByUserAndHouse(Long userId, Long houseId);
}
