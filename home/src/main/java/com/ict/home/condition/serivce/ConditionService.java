package com.ict.home.condition.serivce;

import com.ict.home.condition.dto.ConditionDTO;
import org.springframework.stereotype.Service;

@Service
public interface ConditionService {

    void saveConditions(ConditionDTO conditionDTO, Long userId);
}
