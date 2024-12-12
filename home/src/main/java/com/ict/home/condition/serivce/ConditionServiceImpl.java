package com.ict.home.condition.serivce;

import com.ict.home.condition.repository.AccountRepository;
import com.ict.home.condition.repository.Condition01Repository;
import com.ict.home.condition.repository.Condition03Repository;
import com.ict.home.condition.repository.FamilyRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConditionServiceImpl implements ConditionService{

    @PersistenceContext
    private final EntityManager em;

    private final AccountRepository ar;

    private final Condition01Repository c01r;

    private final Condition03Repository c03r;

    private final FamilyRepository fr;


}
