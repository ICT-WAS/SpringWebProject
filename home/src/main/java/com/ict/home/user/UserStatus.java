package com.ict.home.user;

import lombok.Getter;

@Getter
public enum UserStatus {
    ACTIVE("활성"),
    INACTIVE("비활성");

    private final String userStatusInKorea;

    UserStatus(String userStatusInKorea) {
        this.userStatusInKorea = userStatusInKorea;
    }

}
