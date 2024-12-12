package com.ict.home.user;

import lombok.Getter;

@Getter
public enum UserVerify {
    EMAIL_VERIFIED("이메일 인증"),   // 이메일 인증 완료
    PHONE_VERIFIED("핸드폰 인증"),  // 핸드폰 인증 완료
    UNVERIFIED("미인증");          // 미인증

    private final String userVerifyInKorea;

    UserVerify(String userVerifyInKorea) {
        this.userVerifyInKorea = userVerifyInKorea;
    }

}
