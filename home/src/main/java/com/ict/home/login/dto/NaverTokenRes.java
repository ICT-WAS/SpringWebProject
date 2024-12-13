package com.ict.home.login.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor //역직렬화를 위한 기본 생성자
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverTokenRes {
    /**
     * 네이버 디벨로퍼: https://developers.naver.com/docs/login/api/api.md
     * 참고 문서: https://notspoon.tistory.com/43
     */

    @JsonProperty("access_token")
    public String accessToken;

    @JsonProperty("refresh_token")
    public String refreshToken;

    @JsonProperty("token_type")
    public String tokenType;

    @JsonProperty("expires_in")
    public String expiresIn;

    @JsonProperty("error")
    public String error;

    @JsonProperty("error_description")
    public String errorDescription;
}
