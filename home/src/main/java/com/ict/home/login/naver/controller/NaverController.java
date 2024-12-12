package com.ict.home.login.naver.controller;

import com.ict.home.exception.BaseResponse;
import com.ict.home.login.kakao.dto.GetKakaoLoginRes;
import com.ict.home.login.naver.dto.GetNaverLoginRes;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/naver")
public class NaverController {

    @Value("${naver.client.id}")
    private String clientId;
    @Value("${naver.redirect.uri}")
    private String redirectUri;

    /**
     * 네이버 접근 client ID, redirect URI 반환 -> 서버에서만 가지고 있음
     */
    @GetMapping("/data")
    public BaseResponse<GetNaverLoginRes> sendNaverLoginData() {
        GetNaverLoginRes getNaverLoginRes = new GetNaverLoginRes();
        getNaverLoginRes.setClientId(clientId);
        getNaverLoginRes.setRedirectUri(redirectUri);

        return new BaseResponse<>(getNaverLoginRes);
    }
}
