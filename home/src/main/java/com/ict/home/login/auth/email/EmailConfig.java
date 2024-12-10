package com.ict.home.login.auth.email;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@PropertySource("classpath:application.properties")
@ConfigurationProperties(prefix = "mail")
@Getter
@Setter
@ToString
public class EmailConfig {
    //네이버 - 메일 - 환경설정 - POP3/SMTP 설정 - 사용함
    @Value("${mail.username}")
    private String username;
    @Value("${mail.password}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

        //서버 명 - SMTP 서버명 : smtp.naver.com
        javaMailSender.setHost("smtp.naver.com");  //메인 도메인 서버 주소
        javaMailSender.setUsername(username);
        javaMailSender.setPassword(password);

        //포트 정보 - SMTP 포트 : 465, 보안 연결(SSL) 필요
        javaMailSender.setPort(465);

        javaMailSender.setJavaMailProperties(getMailProperties());  //메일 인증 서버 정보 가져오기

        return javaMailSender;
    }

    private Properties getMailProperties() {
        Properties properties = new Properties();

        properties.setProperty("mail.transport.protocol", "smtp"); // 프로토콜 설정
        properties.setProperty("mail.smtp.auth", "true"); // smtp 인증
        properties.setProperty("mail.smtp.ssl.enable", "true"); // ssl 사용
        properties.setProperty("mail.smtp.starttls.enable", "false"); // smtp strattles 비활성화
        properties.setProperty("mail.smtp.ssl.trust", "smtp.naver.com"); // ssl 인증 서버는 smtp.naver.com
        properties.setProperty("mail.debug", "false"); // 디버그 사용

        return properties;
    }
}
