package com.ict.home.condition.enumeration;

public enum AccountType {
    SAVINGS_ACCOUNT("청약예금"),
    SAVINGS_PLAN("청약부금"),
    SAVINGS_DEPOSIT("청약저축"),
    COMBINED_SAVINGS("주택청약종합저축");

    private String korName;

    public String getKorName() {
        return korName;
    }

    AccountType(String korName) {
        this.korName = korName;
    }
}
