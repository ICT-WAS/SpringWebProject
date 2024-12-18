package com.ict.home.condition.serivce;

import com.ict.home.condition.dto.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ConditionService {

    void saveConditions(ConditionDTO conditionDTO, Long userId);

    GetConditionDTO getConditions(Long userId);

    void updateCondition1(Condition01DTO condition01DTO, List<AccountDTO> accountDTOList, Long userId);
    void updateCondition2(List<FamilyDTO> familyDTOList, Long userId);
    void updateCondition3(Condition03DTO condition03DTO, Long userId);

    void deleteConditions(Long userId);
}
