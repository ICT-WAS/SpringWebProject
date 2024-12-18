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
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

        saveCondition01(conditionDTO.getCondition01DTO(), user);
        saveAccountList(conditionDTO.getAccountDTOList(), user);
        saveCondition03(conditionDTO.getCondition03DTO(), user);
        saveFamilyList(conditionDTO.getFamilyDTOList(), user);
    }

    @Override
    public GetConditionDTO getConditions(Long userId) {

        GetConditionDTO getConditionDTO = new GetConditionDTO();

        Condition01 condition01 = c01r.findByUser_Id(userId);
        Condition03 condition03 = c03r.findByUser_Id(userId);
        List<Account> accountList = ar.findByUser_Id(userId);

        Optional<Account> accountData = accountList.stream()
                .filter(account -> account.getRelationship() == 1)
                .findAny();
        Optional<Account> spouseAccountData = accountList.stream()
                .filter(account -> account.getRelationship() == 2)
                .findAny();

        List<Family> familyData = fr.findByUser_Id(userId);

        List<Family> familyList = familyData.stream()
                .filter(family -> family.getLivingTogether() == 1)
                .collect(Collectors.toList());
        List<Family> spouseFamilyList = familyData.stream()
                .filter(family -> family.getLivingTogether() == 2)
                .collect(Collectors.toList());

        getConditionDTO.setCondition01(condition01);
        getConditionDTO.setCondition03(condition03);
        getConditionDTO.setAccountData(accountData.orElse(null));
        getConditionDTO.setSpouseAccountData(spouseAccountData.orElse(null));
        getConditionDTO.setFamilyList(familyList);
        getConditionDTO.setSpouseFamilyList(spouseFamilyList);

        // 배우자 동거 여부
        String spouse = spouseFamilyList.isEmpty() ? "Y" : "N";
        // 배우자 청약통장 소유 여부
        String spouseHasAccount = spouseAccountData.isPresent() ? "Y" : "N";
        SpouseFormData spouseFormData = new SpouseFormData(spouse, spouseHasAccount);

        getConditionDTO.setSpouseFormData(spouseFormData);

        return getConditionDTO;
    }

    @Override
    public void updateCondition1(Condition01DTO condition01DTO, List<AccountDTO> accountDTOList, Long userId) {
        updateCondition01(userId, condition01DTO);
        updateAccountList(userId, accountDTOList);
    }

    private void updateCondition01(Long userId, Condition01DTO condition01DTO) {
        Condition01 condition01 = c01r.findByUser_Id(userId);

        condition01.setBirthday(condition01DTO.getBirthday());
        condition01.setSiDo(condition01DTO.getSiDo());
        condition01.setGunGu(condition01DTO.getGunGu());
        condition01.setTransferDate(condition01DTO.getTransferDate());
        condition01.setRegionMoveInDate(condition01DTO.getRegionMoveInDate());
        condition01.setMetropolitanAreaDate(condition01DTO.getMetropolitanAreaDate());
        condition01.setIsHouseHolder(condition01DTO.getIsHouseHolder());
        condition01.setMarried(condition01DTO.getMarried());
        condition01.setMarriedDate(condition01DTO.getMarriedDate());

        c01r.save(condition01);
    }

    private void updateAccountList(Long userId, List<AccountDTO> accountDTOList) {
        List<Account> accountList = ar.findByUser_Id(userId);
        User user = ur.getReferenceById(userId);

        for (Account account : accountList) {
            ar.delete(account);
        }

        saveAccountList(accountDTOList, user);
    }

    @Override
    public void updateCondition2(List<FamilyDTO> familyDTOList, Long userId) {

        updateFamilyList(familyDTOList, userId);
    }

    void updateFamilyList(List<FamilyDTO> familyDTOList, Long userId) {
        List<Family> familyList = fr.findByUser_Id(userId);
        User user = ur.getReferenceById(userId);

        for (Family family : familyList) {
            fr.delete(family);
        }

        saveFamilyList(familyDTOList, user);
    }

    @Override
    public void updateCondition3(Condition03DTO condition03DTO, Long userId) {

        updateCondition03(userId, condition03DTO);
    }

    public void updateCondition03(Long userId, Condition03DTO condition03DTO) {
        Condition03 condition03 = c03r.findByUser_Id(userId);

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

        c03r.save(condition03);
    }

    private void saveFamilyList(List<FamilyDTO> familyDTOList, User user) {
        List<Family> familyList = new ArrayList<>();

        for (FamilyDTO familyDTO : familyDTOList) {
            Family family = new Family();
            family.setUser(user);
            family.setSeqIndex(familyDTO.getSeqIndex());
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

    private void saveCondition03(Condition03DTO condition03DTO, User user) {
        Condition03 condition03 = new Condition03();

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

    private void saveAccountList(List<AccountDTO> accountDTOList, User user) {
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

    private void saveCondition01(Condition01DTO condition01DTO, User user) {
        // DTO에서 데이터를 꺼내 JPA 엔티티로 변환 후 저장
        Condition01 condition01 = new Condition01();

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
