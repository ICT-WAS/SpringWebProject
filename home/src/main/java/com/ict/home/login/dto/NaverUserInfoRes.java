package com.ict.home.login.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor //역직렬화를 위한 기본 생성자
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverUserInfoRes {

    private String resultcode;
    private String message;

    private NaverUserDetail response;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NaverUserDetail {
        //네이버 아이디마다 고유하게 발급되는 유니크한 일련번호 값
        @JsonProperty("id")
        public String id;

        @JsonProperty("nickname")
        public String nickname;

        @JsonProperty("name")
        public String username;

        @JsonProperty("email")
        public String email;

        @JsonProperty("gender")
        public String gender;

        @JsonProperty("age")
        public String age;

        @JsonProperty("birthday")
        public String birthday;

        @JsonProperty("profile_image")
        public String profileImage;

        @JsonProperty("birthyear")
        public String birthYear;

        @JsonProperty("mobile")
        public String phoneNumber;
    }


}
