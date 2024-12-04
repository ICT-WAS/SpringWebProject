package com.ict.home.login.jwt;

import com.ict.home.exception.BaseException;
import com.ict.home.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;

import java.security.Key;
import java.util.Date;

import static com.ict.home.exception.BaseResponseStatus.EXPIRED_USER_JWT;

@Slf4j
@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 15; //15일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 15; // 15분

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
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
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
    public String BearerRemove(String token) {
        return token.substring("Bearer ".length());
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
}
