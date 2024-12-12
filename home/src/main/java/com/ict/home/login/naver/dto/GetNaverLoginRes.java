package com.ict.home.login.naver.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetNaverLoginRes {
    private String clientId;
    private String redirectUri;
}
