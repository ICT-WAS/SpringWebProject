package com.ict.home.login.kakao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GetKakaoUserRes {
    private String username;
    private String nickName;
}
