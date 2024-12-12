package com.ict.home.condition.serivce;

import org.springframework.http.ResponseEntity;

public interface ConditionService {
    ResponseEntity<String> deleteConditions(Long userId);
}
