package com.ict.home.login.auth.dto;

import com.ict.home.login.auth.enums.VerificationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PostVerifyAuthReq {
    @Email(message = "유효한 이메일 주소를 입력해주세요.")  //스프링이 제공하는 이메일 유효성 검증
    String email;

    @Pattern(regexp = "^01([0-9])-([0-9]{3,4})-([0-9]{4})$", message = "유효한 전화번호 형식을 입력해주세요.")  //스프링이 제공하는 패턴 검증
    String phoneNumber;

    @NotNull(message = "인증 코드는 필수 항목입니다.")
    String verificationCode;

    @NotNull(message = "인증 방법은 필수 항목입니다.")
    VerificationType verificationType;
}
