package com.ict.home.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                //허용 origin 경로 설정
                .allowedOrigins("http://localhost:3000")
                //허용 HTTP 메서드 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                //허용 헤더 설정
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin")
                //쿠키 포함 인증 정보 허용 설정 - 클라이언트 credentials: 'include' 설정 필수
                .allowCredentials(true);
    }
}
