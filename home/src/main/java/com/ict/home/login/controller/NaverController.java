package com.ict.home.login.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.login.dto.GetNaverLoginRes;
import com.ict.home.login.dto.NaverCallbackReq;
import com.ict.home.login.dto.NaverUserInfoRes;
import com.ict.home.login.repository.SocialAccountRepository;
import com.ict.home.login.service.KakaoService;
import com.ict.home.login.service.NaverService;
import com.ict.home.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import static com.ict.home.exception.BaseResponseStatus.POST_USERS_EXISTS_EMAIL;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/naver")
public class NaverController {

    @Value("${naver.client.id}")
    private String clientId;
    @Value("${naver.redirect.uri}")
    private String redirectUri;

    private final NaverService naverService;
    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;

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

    /**
     * 네이버 로그인 - 회원 정보 없을 시 회원가입 진행 후 로그인
     */
    @PostMapping("/callback")
    public BaseResponse<?> callback(@RequestBody NaverCallbackReq naverCallbackReq, HttpServletResponse response) throws JsonProcessingException {
        String accessToken = naverService.getAccessTokenFromNaver(naverCallbackReq.getCode(), naverCallbackReq.getState());
        NaverUserInfoRes userInfo = naverService.getUserInfo(accessToken);
        String providerUserId = userInfo.getResponse().getId();

        try {
            if (!socialAccountRepository.existsByProviderUserId(providerUserId)) {
                naverService.naverSignup(userInfo, providerUserId);
            }
            return new BaseResponse<>(naverService.naverLogin(providerUserId, response));
        } catch (BaseException exception) {
            return new BaseResponse<>(exception.getStatus());
        }
    }
}
