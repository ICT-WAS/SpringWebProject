package com.ict.home.condition.dto;

import com.ict.home.condition.model.Account;
import com.ict.home.condition.model.Condition01;
import com.ict.home.condition.model.Condition03;
import com.ict.home.condition.model.Family;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString
public class GetConditionDTO {

    private Condition01 condition01;

    private Account accountData;
    private Account spouseAccountData;

    private Condition03 condition03;

    private List<Family> familyList;
    private List<Family> spouseFamilyList;

    private SpouseFormData spouseFormData;

    public boolean isEmpty() {
        return condition01 == null || condition03 == null || accountData == null || familyList == null;
    }
}