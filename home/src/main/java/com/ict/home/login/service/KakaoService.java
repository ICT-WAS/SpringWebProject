package com.ict.home.login.service;

import com.ict.home.login.jwt.JwtProvider;
import com.ict.home.login.jwt.Token;
import com.ict.home.login.jwt.TokenRepository;
import com.ict.home.login.dto.KakaoTokenRes;
import com.ict.home.login.dto.KakaoUserInfoRes;
import com.ict.home.login.model.SocialAccount;
import com.ict.home.login.repository.SocialAccountRepository;
import com.ict.home.user.dto.PostLoginRes;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import com.ict.home.user.service.UserService;
import io.netty.handler.codec.http.HttpHeaderValues;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoService {

    @Value("${kakao.client.id}")
    private String clientId;

    //kakao 인증 관련 api
    private static final String KAUTH_TOKEN_URL_HOST = "https://kauth.kakao.com";
    //kakao 사용자 정보 관련 api
    private static final String KAUTH_USER_URL_HOST = "https://kapi.kakao.com";

    private final UserService userService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtProvider jwtProvider;
    private final SocialAccountRepository socialAccountRepository;

    /**
     * 카카오 콜백 메서드
     */
    public String getAccessTokenFromKakao(String code) {
        KakaoTokenRes kakaoTokenRes = WebClient.create(KAUTH_TOKEN_URL_HOST).post()  // 기본 url 경로
                .uri(uriBuilder -> uriBuilder  //url 경로 생성
                        .scheme("https")
                        .path("/oauth/token")
                        .queryParam("grant_type", "authorization_code")
                        .queryParam("client_id", clientId)
                        .queryParam("code", code)
                        .build(true))
                //요청 헤더 설정
                .header(HttpHeaders.CONTENT_TYPE, HttpHeaderValues.APPLICATION_X_WWW_FORM_URLENCODED.toString())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> Mono.error(new RuntimeException("Invalid Parameter")))
                .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> Mono.error(new RuntimeException("Internal Server Error")))
                .bodyToMono(KakaoTokenRes.class)
                .block();

        log.info(" [Kakao Service] Access Token ------> {}", kakaoTokenRes.getAccessToken());
        log.info(" [Kakao Service] Refresh Token ------> {}", kakaoTokenRes.getRefreshToken());
        //제공 조건: OpenID Connect가 활성화 된 앱의 토큰 발급 요청인 경우 또는 scope에 openid를 포함한 추가 항목 동의 받기 요청을 거친 토큰 발급 요청인 경우
        log.info(" [Kakao Service] Id Token ------> {}", kakaoTokenRes.getIdToken());
        log.info(" [Kakao Service] Scope ------> {}", kakaoTokenRes.getScope());

        return kakaoTokenRes.getAccessToken();
    }

    /**
     * 카카오 발급 액세스 토큰으로 유저 정보 가져오기
     */
    public KakaoUserInfoRes getUserInfo(String accessToken) {

        KakaoUserInfoRes userInfo = WebClient.create(KAUTH_USER_URL_HOST)
                .get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .path("/v2/user/me")
                        .build(true))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken) // access token 인가
                .header(HttpHeaders.CONTENT_TYPE, HttpHeaderValues.APPLICATION_X_WWW_FORM_URLENCODED.toString())
                .retrieve()
                //TODO : Custom Exception
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> Mono.error(new RuntimeException("Invalid Parameter")))
                .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> Mono.error(new RuntimeException("Internal Server Error")))
                .bodyToMono(KakaoUserInfoRes.class)
                .block();

        log.info("[Kakao Service] Auth ID ---> {} ", userInfo.getId());
        log.info("[Kakao Service] NickName ---> {} ", userInfo.getKakaoAccount().getProfile().getNickName());
        log.info("[Kakao Service] email ---> {} ", userInfo.getKakaoAccount().getEmail());

        return userInfo;
    }

    /**
     * 카카오 소셜 계정 테이블 할당
     */
    @Transactional
    public User kakaoSignup(KakaoUserInfoRes userInfo, String providerUserId) {
        User user = new User();

        user.createUser(userInfo.getKakaoAccount().getProfile().getNickName(), userInfo.getKakaoAccount().getEmail(), true);
        userRepository.save(user);

        //어카운트 테이블 생성 및 할당
        SocialAccount socialAccount = SocialAccount.builder()
                .user(user)
                .provider("kakao")
                .providerUserId(providerUserId)
                .build();
        socialAccountRepository.save(socialAccount);

        return user;
    }

    /**
     * 카카오 소셜 계정 로그인
     */
    @Transactional
    public PostLoginRes kakaoLogin(String providerUserId, HttpServletResponse response) {
        User user = socialAccountRepository.findByProviderUserId(providerUserId).getUser();

        //액세스 토큰 발급
        String accessToken = jwtProvider.createAccessToken(user);

        String refreshToken;
        //유저와 연결된 리프레시 토큰 존재 확인
        if (tokenRepository.existsByUserId(user.getId())) {
            //리프레시  토큰이 있는 경우
            Token token = tokenRepository.findByUserId(user.getId());
            //리프레시 토큰의 만료 확인 후 반환 or 발급
            refreshToken = userService.checkRefreshTokenExpire(token, user);  //현재 유저의 리프레시 토큰
        }else {
            //리프레시 토큰이 없는 경우 - 리프레시 토큰 발급 후 디비 저장
            refreshToken = userService.createAndSaveRefreshToken(user);
        }

        //리프레시 토큰을 HTTP-Only 쿠키에 할당 -> 클라이언트에서 접근 불가
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);  //Javascript 에서 접근 불가
        refreshTokenCookie.setSecure(false);  //true: HTTPS 에서만 전송
        refreshTokenCookie.setPath("/");  //모든 경로에서 쿠키 사용 가능
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 15);  //15일 유효

        response.addCookie(refreshTokenCookie);

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        //유저 정보와 액세스토큰을 담은 객체를 클라이언트에 반환
        return new PostLoginRes(user, accessToken);
    }
}
