package com.ict.home.login.controller;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.login.dto.GetKakaoLoginRes;
import com.ict.home.login.dto.KakaoUserInfoRes;
import com.ict.home.login.repository.SocialAccountRepository;
import com.ict.home.login.service.KakaoService;
import com.ict.home.user.repository.UserRepository;
import com.ict.home.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import static com.ict.home.exception.BaseResponseStatus.POST_USERS_EXISTS_EMAIL;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
public class KakaoController {

    @Value("${kakao.client.id}")
    private String clientId;
    @Value("${kakao.redirect.uri}")
    private String redirectUri;

    private final KakaoService kakaoService;
    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;

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
     * 카카오톡 로그인 - 회원 정보 없을 시 회원가입 진행 후 로그인
     */
    @PostMapping("/callback")
    public BaseResponse<?> callback(@RequestBody String code, HttpServletResponse response) {
        //카카오 인증 이후 액세스토큰 받아오기
        String accessToken = kakaoService.getAccessTokenFromKakao(code);
        //발급받은 액세스토큰으로 유저 정보 받아오기
        KakaoUserInfoRes userInfo = kakaoService.getUserInfo(accessToken);
        //정보 잘 받아왔다면 provider 제공 userId 를 찾기
        String providerUserId = userInfo.getId().toString();

        try {
            if (!socialAccountRepository.existsByProviderUserId(providerUserId)) {
                //카카오 유저 정보와 일치하는 소셜 테이블 정보가 없는 경우 자동으로 소셜 회원가입
                kakaoService.kakaoSignup(userInfo, providerUserId);
            }
            //받아온 providerUserId 로 로그인
            return new BaseResponse<>(kakaoService.kakaoLogin(providerUserId, response));
        } catch (BaseException exception) {
            return new BaseResponse<>(exception.getStatus());
        }
    }
}
