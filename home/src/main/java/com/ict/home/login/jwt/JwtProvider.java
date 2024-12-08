package com.ict.home.login.jwt;

import com.ict.home.exception.BaseException;
import com.ict.home.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;

import java.io.IOException;
import java.security.Key;
import java.util.Date;

import static com.ict.home.exception.BaseResponseStatus.*;

@Slf4j
@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 15; //15일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 15; // 15분
    //만료 테스트 10초
//    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 10; // 10초

    private static final String BEARER_TYPE = "Bearer ";

    private final Key key = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(Secret.JWT_SECRET_KEY));

    /**
     * Access 토큰 생성
     */
    public String createAccessToken(User user) {
        //현재 시각을 담을 객체 생성
        Date now = new Date();
        //현재 시각과 액세스 토큰 유효 시간을 사용해 AccessToken 만료 시간 정의
        Date expiration = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME);

        //JWT 토큰 생성
        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)  //TYPE: JWT 표준, JWT_TYPE: 토큰의 유형
                .claim("userId", user.getId())
                .setIssuer("ict")  //토큰 발급자 명
                .setIssuedAt(now)  //발급 시간
                .setExpiration(expiration)  //위에서 정의한 만료 시간
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * refreshToken 생성
     */
    public String createRefreshToken(User user) {
        //현재 시각을 담을 객체 생성
        Date now = new Date();
        //현재 시각과 리프레시 토큰의 유효 시간을 사용해 리프레시 토큰 만료 시간 정의
        Date expiration = new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME);

        //JWT 토큰 생성
        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)  //TYPE: JWT 표준, JWT_TYPE: 토큰의 유형
                .claim("userId", user.getId())
                .setIssuer("ict")  //토큰 발급자 명
                .setIssuedAt(now)  //발급 시간
                .setExpiration(expiration)  //위에서 정의한 만료 시간
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    //토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            //유효할 시 true
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;

            //에러 발생 시 false
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT Token", e);
        } catch (SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT 클레임 빈 문자열", e);
        } catch (Exception e) {
            log.error("알 수 없는 오류", e);
        }
        return false;
    }

    //토큰의 Bearer 제거 메서드
    public String bearerRemove(String token) {
        return token.substring(BEARER_TYPE.length());
    }

    //토큰의 남은 유효시간
    public Long getExpiration(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        // 현재 시간
        long now = System.currentTimeMillis();
        return (expiration.getTime() - now);
    }

    /**
     * 토큰에서 유저 아이디 추출
     */
    public Long getUserIdFromToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //요청 header 에서 Authorization 부분만 추출
        String authHeader = request.getHeader("Authorization");
        log.info("jwtProvider authHeader: {}", authHeader);

        //추출한 문장이 null 이거나 Bearer 로 시작하지 않을 시 '유효하지 않은 토큰'
        if (authHeader == null || !authHeader.startsWith(BEARER_TYPE)) {
            throw new BaseException(INVALID_JWT);
        }

        //추출한 풀 토큰에서 맨 앞 Bearer 제거
        String token = bearerRemove(authHeader);
        log.info("jwtProvider token: {}", token);

        //토큰 유효성 검사 - 실패 시 '유효하지 않은 토큰'
//        if (!validateToken(token)) {
//            throw new BaseException(INVALID_JWT);
//        }

        //사용자 정보 추출
        long userId = 0;
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            //유저 확인
            claims.forEach((key1, value) -> log.info("Key: {}, Value:{}", key1, value));
            userId = claims.get("userId", Long.class);
            
        }catch (ExpiredJwtException e) {
            log.error("JWT 토큰 만료, 사용자 인증 실패", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  //401 에러 반환
        }catch (Exception e) {
            throw new BaseException(USER_NOT_FOUND_IN_TOKEN);
        }
        return userId;
    }
}
