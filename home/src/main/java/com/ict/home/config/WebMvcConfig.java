package com.ict.home.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private TokenInterceptor tokenInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                //허용 origin 경로 설정
                .allowedOrigins("http://localhost:3000")
                //허용 HTTP 메서드 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                //허용 헤더 설정
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin")
                //쿠키 포함 인증 정보 허용 설정 - 클라이언트 credentials: 'include' 설정 필수
                .allowCredentials(true);
    }

//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(tokenInterceptor)
//                .order(1)
//                .addPathPatterns("/**")  // "/" 루트하위에 전부 적용
//                .excludePathPatterns("/users/login", "/users", "/descriptions/**");  //그 중 제외할 경로
//    }
}
