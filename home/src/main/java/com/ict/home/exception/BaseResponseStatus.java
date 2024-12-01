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
    // users
    USERS_EMPTY_USER_ID(false, 2010, "유저 아이디 값을 확인해주세요."),
    INVALID_MEMBER_ID(false, 2011, "멤버 아이디와 이메일이 일치하지 않습니다."),
    PASSWORD_CANNOT_BE_NULL(false, 2012, "비밀번호를 입력해주세요."),

    /**
     * 3000: Response 오류
     */


    /**
     * 4000: Database, Server 오류
     */
    PASSWORD_ENCRYPTION_ERROR(false, 4011, "비밀번호 암호화에 실패하였습니다.");

    private final boolean isSuccess;
    private final int code;
    private final String message;

    private BaseResponseStatus(boolean isSuccess, int code, String message) { //BaseResponseStatus 에서 각 해당하는 코드를 생성자로 매핑
        this.isSuccess = isSuccess;
        this.code = code;
        this.message = message;
    }
}
