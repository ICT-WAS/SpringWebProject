package com.ict.home.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Slf4j
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests ->
//                        authorizeRequests
//                                //메인페이지, 회원가입,로그인,로그아웃 허용 - > 차후 페이지 별로 인증 여부 확인
//                                .requestMatchers("/", "/users/**").permitAll()
//                                .anyRequest().authenticated()
                        authorizeRequests
                                .anyRequest().permitAll()
                );

        //CorsFilter 추가 시 순서 지정
        http.addFilterAfter(
                jwtAuthenticationFilter,  //JWT 인증 필터
                //import org.springframework.web.filter.CorsFilter;
                CorsFilter.class  // CORS 필터 후에 JWT 인증 필터 추가
        );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");  //3000포트 허용
        configuration.addAllowedMethod("*");  //GET, POST 등 모든 HTTP 메서드 허용
        configuration.addAllowedHeader("*");  //모든 HTTP 헤더 허용
        configuration.setAllowCredentials(true);  //쿠키, 인증정보 등을 포함한 요청 허용
        configuration.setMaxAge(3600L);  //CORS 옵션 요청 캐싱 허가

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  //모든 URL 패턴에 대해 CORS 규칙 적용
        return source;
    }
}