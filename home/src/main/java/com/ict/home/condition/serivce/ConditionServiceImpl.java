package com.ict.home.condition.serivce;

import com.ict.home.condition.dto.*;
import com.ict.home.condition.model.Account;
import com.ict.home.condition.model.Condition01;
import com.ict.home.condition.model.Condition03;
import com.ict.home.condition.model.Family;
import com.ict.home.condition.repository.AccountRepository;
import com.ict.home.condition.repository.Condition01Repository;
import com.ict.home.condition.repository.Condition03Repository;
import com.ict.home.condition.repository.FamilyRepository;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConditionServiceImpl implements ConditionService{

    @PersistenceContext
    private final EntityManager em;

    private final UserRepository ur;

    private final AccountRepository ar;

    private final Condition01Repository c01r;

    private final Condition03Repository c03r;

    private final FamilyRepository fr;


    @Override
    @Transactional
    public void saveConditions(ConditionDTO conditionDTO, Long userId) {

        User user = ur.getReferenceById(userId);

        saveCondition01(conditionDTO, user);
        saveAccountList(conditionDTO, user);
        saveCondition03(conditionDTO, user);
        saveFamilyList(conditionDTO, user);
    }

    private void saveFamilyList(ConditionDTO conditionDTO, User user) {
        List<FamilyDTO> familyDTOList = conditionDTO.getFamilyDTOList();
        List<Family> familyList = new ArrayList<>();

        for (FamilyDTO familyDTO : familyDTOList) {
            Family family = new Family();
            family.setUser(user);
            family.setRelationship(familyDTO.getRelationship());
            family.setLivingTogether(familyDTO.getLivingTogether());
            family.setLivingTogetherDate(familyDTO.getLivingTogetherDate());
            family.setBirthday(familyDTO.getBirthday());
            family.setIsMarried(familyDTO.getIsMarried());
            family.setHouseCount(familyDTO.getHouseCount());
            family.setHouseSoldDate(familyDTO.getHouseSoldDate());

            familyList.add(family);
        }

        for (Family family : familyList) {
            Family savedFamily = fr.save(family);
            if(savedFamily.getFamilyId() == null) {
                throw new RuntimeException("가족 저장 실패: " + family);
            }
        }
    }

    private void saveCondition03(ConditionDTO conditionDTO, User user) {
        Condition03 condition03 = new Condition03();
        Condition03DTO condition03DTO = conditionDTO.getCondition03DTO();
        condition03.setUser(user);
        condition03.setCarPrice(condition03DTO.getCarPrice());
        condition03.setPropertyPrice(condition03DTO.getPropertyPrice());
        condition03.setTotalAsset(condition03DTO.getTotalAsset());
        condition03.setMyAsset(condition03DTO.getMyAsset());
        condition03.setSpouseAsset(condition03DTO.getSpouseAsset());
        condition03.setFamilyAverageMonthlyIncome(condition03DTO.getFamilyAverageMonthlyIncome());
        condition03.setPreviousYearAverageMonthlyIncome(condition03DTO.getPreviousYearAverageMonthlyIncome());
        condition03.setIncomeActivity(condition03DTO.getIncomeActivity());
        condition03.setSpouseAverageMonthlyIncome(condition03DTO.getSpouseAverageMonthlyIncome());
        condition03.setIncomeTaxPaymentPeriod(condition03DTO.getIncomeTaxPaymentPeriod());
        condition03.setLastWinned(condition03DTO.getLastWinned());
        condition03.setIneligible(condition03DTO.getIneligible());

        Condition03 savedCondition03 = c03r.save(condition03);
        if(savedCondition03.getCondition03Id() == null) {
            throw new RuntimeException("조건3 저장 실패: " + condition03);
        }
    }

    private void saveAccountList(ConditionDTO conditionDTO, User user) {
        List<AccountDTO> accountDTOList = conditionDTO.getAccountDTOList(); // DTO에서 AccountDTO 리스트 가져오기
        List<Account> accountList = new ArrayList<>();

        for (AccountDTO accountDTO : accountDTOList) {
            Account account = new Account();
            account.setUser(user);
            account.setType(accountDTO.getType());
            account.setCreatedAt(accountDTO.getCreatedAt());
            account.setPaymentCount(accountDTO.getPaymentCount());
            account.setTotalAmount(accountDTO.getTotalAmount());
            account.setRecognizedAmount(accountDTO.getRecognizedAmount());
            account.setRelationship(accountDTO.getRelationship());

            accountList.add(account);
        }

        for (Account account : accountList) {
            Account savedAccount = ar.save(account);
            if(savedAccount.getAccountId() == null) {
                throw new RuntimeException("청약통장 저장 실패: " + account);
            }
        }
    }

    private void saveCondition01(ConditionDTO conditionDTO, User user) {
        // DTO에서 데이터를 꺼내 JPA 엔티티로 변환 후 저장
        Condition01 condition01 = new Condition01();
        Condition01DTO condition01DTO = conditionDTO.getCondition01DTO();

        condition01.setUser(user);
        condition01.setBirthday(condition01DTO.getBirthday());
        condition01.setSiDo(condition01DTO.getSiDo());
        condition01.setGunGu(condition01DTO.getGunGu());
        condition01.setTransferDate(condition01DTO.getTransferDate());
        condition01.setRegionMoveInDate(condition01DTO.getRegionMoveInDate());
        condition01.setMetropolitanAreaDate(condition01DTO.getMetropolitanAreaDate());
        condition01.setIsHouseHolder(condition01DTO.getIsHouseHolder());
        condition01.setMarried(condition01DTO.getMarried());
        condition01.setMarriedDate(condition01DTO.getMarriedDate());

        Condition01 save = c01r.save(condition01);
        if(save.getCondition01Id() == null) {
            throw new RuntimeException("조건1 저장 실패: " + condition01);
        }
    }
}
