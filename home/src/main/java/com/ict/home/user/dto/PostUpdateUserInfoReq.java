package com.ict.home.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateUserInfoReq {
    //이메일은 수정할 수 없음
    private Long userId;
    @NotNull(message = "사용자 이름은 번호는 필수 항목입니다.")
    @Size(min = 2, max = 12, message = "사용자 이름은 2자 이상 12자 이하로 입력해주세요.")
    private String username;
    @NotNull(message = "휴대전화 번호는 필수 항목입니다.")
    @Pattern(regexp = "^01([0-9])-([0-9]{3,4})-([0-9]{4})$", message = "유효한 전화번호 형식을 입력해주세요.")
    private String phoneNumber;
    //차후 소셜 로그인 연동 구상 되면
    //소셜 로그인 테이블을 만들거나 기존 테이블 연동할 데이터를 어떻게 받아오는지 확인해야 함
    //private List<String> socialLinks;
}
