package com.ict.home.config;

import com.ict.home.login.jwt.JwtProvider;
import com.ict.home.login.jwt.Secret;
import com.ict.home.user.User;
import com.ict.home.user.UserUtilService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.security.Key;

import static java.lang.Long.parseLong;

@Slf4j
@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private UserUtilService userUtilService;
    @Autowired
    private JwtProvider jwtProvider;
    private static final String SECRET_KEY = Secret.JWT_SECRET_KEY;

    private Key getSigninKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    //Interceptor Override
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //CORS 설정 추가
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept, Origin");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        //OPTIONS 요청은 인증 절차를 거치지 않도록
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        //요청 header 에서 Authorization 부분만 추출
        String authHeader = request.getHeader("Authorization");

        //추출한 문장이 null 이거나 Bearer 로 시작하지 않을 시 에러
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("헤더에 Authorization 존재하지 않음");
            return false;
        }

        //추출한 풀 토큰에서 맨 앞 Bearer 제거
        String preAccessToken = jwtProvider.BearerRemove(authHeader);

        //액세스 토큰이 유효한지 확인
        if (jwtProvider.validateToken(preAccessToken)) {

            //리프레시 토큰을 쿠키에서 가져오기
            String refreshToken = getRefreshTokenFromCookies(request);

            //리프레시 토큰이 null 이거나 만료되었을 시(유효하지 않을 시)
            if (refreshToken == null || jwtProvider.getExpiration(refreshToken) >= 0) {
                return false;
            }

        }

        //사용자 정보 추출
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(preAccessToken)
                    .getBody();

            //유저 확인
            Long userId = parseLong(claims.get("userId", String.class));

            //로그인한 사용자가 DB에 있는지 확인
            boolean userExistsInDatabase = userUtilService.findByUserId(userId);
            if (!userExistsInDatabase) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("유효한 사용자가 아닙니다.");
                return false;
            }

            User user = userUtilService.findByIdWithValidation(userId);

            String accessToken = jwtProvider.createAccessToken(user);

            //새로운 액세스 토큰을 응답에 담아서 전송
            response.setHeader("accessToken", accessToken);

            return true;  //요청 진행

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("유효하지 않은 사용자 정보입니다.");
            return false;
        }
    }

    //리프레시 토큰 쿠키에서 가져오기
    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null; // 리프레시 토큰이 없다면 null 반환
    }
}
