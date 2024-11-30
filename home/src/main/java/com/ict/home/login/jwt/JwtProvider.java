package com.ict.home.login.jwt;

import com.ict.home.user.User;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 15; //15일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 15; // 15분

    private static final String BEARER_TYPE = "Bearer ";

    private Key key = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(Secret.JWT_SECRET_KEY));


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
}