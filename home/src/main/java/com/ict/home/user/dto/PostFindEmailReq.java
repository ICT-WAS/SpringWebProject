package com.ict.home.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostFindEmailReq {
    @NotNull(message = "이메일 찾기를 위한 휴대전화 번호 입력은 필수입니다.")
    @Pattern(regexp = "^01([0-9])-([0-9]{3,4})-([0-9]{4})$", message = "유효한 전화번호 형식을 입력해주세요.")
    private String phoneNumber;
}
