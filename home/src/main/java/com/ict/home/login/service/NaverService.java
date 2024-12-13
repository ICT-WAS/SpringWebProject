package com.ict.home.login.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ict.home.login.dto.KakaoUserInfoRes;
import com.ict.home.login.dto.NaverTokenRes;
import com.ict.home.login.dto.NaverUserInfoRes;
import com.ict.home.login.jwt.JwtProvider;
import com.ict.home.login.jwt.Token;
import com.ict.home.login.jwt.TokenRepository;
import com.ict.home.login.model.SocialAccount;
import com.ict.home.login.repository.SocialAccountRepository;
import com.ict.home.user.User;
import com.ict.home.user.dto.PostLoginRes;
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
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NaverService {
    @Value("${naver.client.id}")
    private String clientId;
    @Value("${naver.client.secret}")
    private String clientSecret;

    private static final String TOKEN_URL_HOST = "https://nid.naver.com";
    private static final String USER_URL_HOST = "https://openapi.naver.com";

    private final UserService userService;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtProvider jwtProvider;
    private final SocialAccountRepository socialAccountRepository;

    /**
     * 네이버 콜백 메서드
     */
    public String getAccessTokenFromNaver(String code, String state) throws JsonProcessingException {

        //응답이 잘 반환되는지 확인
        String response = WebClient.create(TOKEN_URL_HOST).post()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .path("/oauth2.0/token")
                        .queryParam("grant_type", "authorization_code")
                        .queryParam("client_id", clientId)
                        .queryParam("client_secret", clientSecret)
                        .queryParam("code", code)
                        .queryParam("state", state)
                        .build())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        log.info("Response from Naver API: {}", response);

        ObjectMapper objectMapper = new ObjectMapper();
        NaverTokenRes naverTokenRes = objectMapper.readValue(response, NaverTokenRes.class);

        log.info(" [Naver Service] Access Token ------> {}", naverTokenRes.getAccessToken());
        log.info(" [Naver Service] Refresh Token ------> {}", naverTokenRes.getRefreshToken());

        return naverTokenRes.getAccessToken();
    }

    public NaverUserInfoRes getUserInfo(String accessToken) {
        log.info("naver accessToken = {}", accessToken);
        NaverUserInfoRes userInfo = WebClient.create(USER_URL_HOST)
                .get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .path("/v1/nid/me")
                        .build(true))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken) // access token 인가
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                //TODO : Custom Exception
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> Mono.error(new RuntimeException("Invalid Parameter")))
                .onStatus(HttpStatusCode::is5xxServerError, clientResponse -> Mono.error(new RuntimeException("Internal Server Error")))
                .bodyToMono(NaverUserInfoRes.class)
                .block();

        log.info("[Naver Service] Auth ID ---> {} ", userInfo.getResponse().getId());
        log.info("[Naver Service] NickName ---> {} ", userInfo.getResponse().getNickname());
        log.info("[Naver Service] email ---> {} ", userInfo.getResponse().getEmail());

        return userInfo;
    }

    /**
     * 네이버 소셜 계정 테이블 할당
     */
    @Transactional
    public User naverSignup(NaverUserInfoRes userInfo, String providerUserID) {
        User user = new User();

        user.createUser(userInfo.getResponse().getUsername(), userInfo.getResponse().getEmail(), true);
        userRepository.save(user);

        //어카운트 테이블 생성 및 할당
        SocialAccount socialAccount = SocialAccount.builder()
                .user(user)
                .provider("naver")
                .providerUserId(providerUserID)
                .build();
        socialAccountRepository.save(socialAccount);

        return user;
    }

    /**
     * 네이버 소셜 계정 로그인
     */
    @Transactional
    public PostLoginRes naverLogin(String providerUserId, HttpServletResponse response) {
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
