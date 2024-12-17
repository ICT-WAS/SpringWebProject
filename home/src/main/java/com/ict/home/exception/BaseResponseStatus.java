package com.ict.home.exception;

import lombok.Getter;

@Getter
public enum BaseResponseStatus {
    /**
     * 1000: 요청 성공
     */
    SUCCESS(true, 1000, "요청에 성공하였습니다."),

    /**
     * 2000: Request 오류
     */
    REQUEST_ERROR(false, 2000, "입력값을 확인해주세요."),
    // [POST] users
    POST_USERS_EXISTS_EMAIL(false,2001,"중복된 이메일입니다."),
    POST_USERS_NONE_EXISTS_EMAIL(false,2002,"등록되지 않은 이메일입니다."),
    POST_USERS_NONE_EXISTS_USERNAME(false, 2003, "등록되지 않은 유저 이름입니다."),
    LOG_OUT_USER(false,2004,"이미 로그아웃된 유저입니다."),
    POST_USERS_NONE_EXISTS_ID(false, 2004, "등록되지 않은 유저 정보입니다."),
    // users
    USERS_EMPTY_USER_ID(false, 2010, "유저 아이디 값을 확인해주세요."),
    INVALID_MEMBER_ID(false, 2011, "멤버 아이디와 이메일이 일치하지 않습니다."),
    PASSWORD_CANNOT_BE_NULL(false, 2012, "비밀번호를 입력해주세요."),
    USERS_NONE_EXISTS_PHONE(false, 2013, "등록되지 않은 핸드폰 번호입니다."),

    // verify
    INVALID_EMAIL_CODE(false, 2020, "이메일 인증 코드가 일치하지 않습니다."),
    CODE_EXPIRED(false, 2021, "인증 코드가 만료되었습니다."),
    INVALID_VERIFICATION_TYPE(false, 2022, "잘못된 인증 타입입니다."),

    /**
     * 3000: Response 오류
     */
    FAILED_TO_LOGIN(false,3001,"이메일과 비밀번호를 다시 확인해주세요."),
    FAILED_TO_LOGOUT(false, 3002, "로그아웃에 실패하였습니다"),

    /**
     * 4000: Database, Server 오류
     */
    PASSWORD_ENCRYPTION_ERROR(false, 4001, "비밀번호 암호화에 실패하였습니다."),
    PASSWORD_DECRYPTION_ERROR(false, 4002, "비밀번호 복호화에 실패하였습니다."),
    SAME_AS_OLD_PASSWORD_ERROR(false, 4003, "현재 비밀번호와 같은 비밀번호는 사용하실 수 없습니다."),
    // email-verify
    EMAIL_SENDING_FAILED(false, 4010, "이메일 발송에 실패했습니다."),
    EMAIL_VERIFICATION_FAILED(false, 4011, "이메일로 사용자 인증을 확인할 수 없습니다."),  // 이메일 인증 실패
    PHONE_VERIFICATION_FAILED(false, 4012, "핸드폰 번호로 사용자 인증을 확인할 수 없습니다."),  // 핸드폰 인증 실패
    VERIFICATION_FAILED(false, 4013, "사용자 인증을 확인할 수 없습니다."),


    /**
     * 5000: 토큰 오류
     */
    EXPIRED_USER_JWT(false,5000,"만료된 JWT입니다."),
    INVALID_JWT(false, 5001, "유효하지 않은 JWT입니다."),
    USER_NOT_FOUND_IN_TOKEN(false, 5002, "토큰으로 유저 정보를 찾는 데 실패하였습니다."),
    TOKEN_NOT_FOUND_IN_USER(false, 5003, "유저 정보로 토큰을 찾는 데 실패하였습니다.");

    private final boolean isSuccess;
    private final int code;
    private final String message;

    private BaseResponseStatus(boolean isSuccess, int code, String message) { //BaseResponseStatus 에서 각 해당하는 코드를 생성자로 매핑
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
    }
}
