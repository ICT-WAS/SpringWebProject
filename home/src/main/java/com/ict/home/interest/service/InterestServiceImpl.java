package com.ict.home.interest.service;

import com.ict.home.house.model.House;
import com.ict.home.house.repository.HouseCustomRepository;
import com.ict.home.house.service.HouseService;
import com.ict.home.interest.model.Interest;
import com.ict.home.interest.repository.InterestRepository;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterestServiceImpl implements InterestService {

    private final HouseService hs;

    private final InterestRepository ir;

    private final UserRepository ur;

    private final HouseCustomRepository hr;

    @Override
    public Interest createInterest(Long userId, Long houseId) {
        Interest interest = new Interest();

        User user = ur.findById(userId).get();

        House house = hr.findById(houseId);

        interest.setUser(user);

        interest.setHouse(house);

        return ir.save(interest);
    }

    @Override
    public boolean deleteInterest(Long interestId) {
        ir.deleteById(interestId);

        return ir.findById(interestId).isPresent() ? false : true;
    }

    @Override
    public List<Interest> readInterest(Long userId) {

        return ir.findByUser_Id(userId);
    }

    @Override
    public Long getInterestIdByUserAndHouse(Long userId, Long houseId) {
        Interest interest = ir.findByUser_IdAndHouse_houseId(userId, houseId);
        if (interest == null) {
            return null;
        } else {
            return interest.getInterestId();
        }
    }
}
