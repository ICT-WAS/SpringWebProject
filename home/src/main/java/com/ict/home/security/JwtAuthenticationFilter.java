package com.ict.home.security;

import com.ict.home.login.jwt.JwtProvider;
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
            String token = parseBearerToken(request);
            log.info("Filter is running...");
            Long userId;

            //토큰 검사. JWT -> 인가를 서버에 요청하지 않고도 검증 가능
            if (token != null && !token.equalsIgnoreCase("null")) {

                //유효할 시 true
                if (jwtProvider.validateToken(token)) {
                    userId = jwtProvider.getUserIdFromToken(request);

                    //인증 완료
                    AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userId,  //인증된 사용자 정보, 보통 UserDetails 라는 오브젝트 할당
                            null,
                            AuthorityUtils.NO_AUTHORITIES
                    );

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    //SecurityContextHolder 업데이트
                    SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                    securityContext.setAuthentication(authenticationToken);
                    SecurityContextHolder.setContext(securityContext);
                }
            }
        } catch (Exception e) {
            logger.error("Could not set user authentication in security context", e);
        }
        //다음 필터 체인 실행
        filterChain.doFilter(request, response);
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
