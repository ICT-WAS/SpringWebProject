package com.ict.home.login.kakao.controller;

import com.ict.home.exception.BaseResponse;
import com.ict.home.login.kakao.dto.GetKakaoLoginRes;
import com.ict.home.login.kakao.dto.KakaoUserInfoRes;
import com.ict.home.login.kakao.service.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
public class KakaoController {

    @Value("${kakao.client.id}")
    private String clientId;
    @Value("${kakao.redirect.uri}")
    private String redirectUri;

    private final KakaoService kakaoService;

    /**
     * 카카오톡 접근 client ID, redirect URI 반환 -> 서버에서만 가지고 있음
     */
    @GetMapping("/data")
    public BaseResponse<GetKakaoLoginRes> sendKakaoLoginData() {
        GetKakaoLoginRes getKakaoLoginRes = new GetKakaoLoginRes();
        getKakaoLoginRes.setClientId(clientId);
        getKakaoLoginRes.setRedirectUri(redirectUri);

        return new BaseResponse<>(getKakaoLoginRes);
    }

    /**
     * 카카오톡 로그인 - 회원가입 안되었을 시 회원가입 진행
     * Issue: 이메일 가져오기 불가, 자동 회원가입 및 로그인 로직 확인 필요
     */
    @PostMapping("/callback")
    public BaseResponse<?> callback(@RequestBody String code) {
        String accessToken = kakaoService.getAccessTokenFromKakao(code);

        KakaoUserInfoRes userInfo = kakaoService.getUserInfo(accessToken);
        return new BaseResponse<>(userInfo);
    }
}
