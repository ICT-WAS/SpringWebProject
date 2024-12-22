package com.ict.home.security;

import com.ict.home.login.jwt.JwtProvider;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            log.info("Filter is running...");
            String token = parseBearerToken(request);
            log.info("JwtAuthenticationFilter token: {}", token);
            Long userId;

            //토큰 검사. JWT -> 인가를 서버에 요청하지 않고도 검증 가능
            if (token != null && !token.equalsIgnoreCase("null")) {

                log.info("JwtAuthenticationFilter is running...");
                userId = jwtProvider.getUserIdFromToken(request, response);
                log.info("userId:{}", userId);

                //인증 완료
                AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userId,  //인증된 사용자 정보, 보통 UserDetails 라는 오브젝트 할당
                        null,
                        AuthorityUtils.NO_AUTHORITIES  //권한 따로 지정하지 않았으므로 권한 없음.
                        // 차후 권한 설정 시 AuthorityUtils.createAuthorityList("ROLE_USER", "ROLE_ADMIN") 형식으로 사용 가능
                );
                log.info("authenticationToken:{}", authenticationToken);

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //SecurityContextHolder 업데이트
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                securityContext.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(securityContext);
            }
            //다음 필터 체인 실행
            filterChain.doFilter(request, response);
            log.info("Filter passed, request forwarded to next filter or handler or filter closing");

        } catch (ExpiredJwtException e) {
            logger.error("JWT 토큰 만료, 사용자 인증 실패", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  //401 에러 반환
            response.getWriter().write("JWT 토큰 만료, 사용자 인증 실패");
        }
    }

    //요청에서 토큰 가져오기
    private String parseBearerToken(HttpServletRequest request) {
        //Http 요청 헤더 파싱, Bearer 토큰 리턴
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            log.info("Authorization header: {}", bearerToken);
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}
