package com.ict.home.condition.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SpouseFormData {
    public SpouseFormData(String spouse, String spouseHasAccount) {
        this.spouse = spouse;
        this.spouseHasAccount = spouseHasAccount;
    }

    String spouse;
    String spouseHasAccount;
}
