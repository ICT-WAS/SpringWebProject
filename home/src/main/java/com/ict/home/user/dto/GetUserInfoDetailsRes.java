package com.ict.home.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetUserInfoDetailsRes {
    private String username;
    private String email;
    private String phoneNumber;
    private String userVerify;  //인증방법
    private List<String> socialLinks;  //소셜 로그인 연동 여러 개 있을 수 있음
}
