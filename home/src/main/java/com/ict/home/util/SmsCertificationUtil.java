package com.ict.home.util;

import jakarta.annotation.PostConstruct;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SmsCertificationUtil {
    @Value("${coolsms.apikey}") // coolsms의 API 키 주입
    private String apiKey;

    @Value("${coolsms.apisecret}") // coolsms의 API 비밀키 주입
    private String apiSecret;

    @Value("${coolsms.fromnumber}") // 발신자 번호 주입
    private String fromNumber;

    DefaultMessageService messageService; // 메시지 서비스를 위한 객체

    @PostConstruct  //의존성 주입 완료 후 초기화 수행
    public void init() {
        //메시지 서비스 초기화
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
    }

    public void sendSMS(String phoneNumber, String verificationCode) {
        Message message = new Message();
        message.setFrom(fromNumber);  //발신자 번호 설정
        message.setTo(phoneNumber);  //수신자 번호 설정
        message.setText("[" + verificationCode + "] 본인확인 인증 번호를 입력하세요! [청약이지]");  //메시지 본문

        this.messageService.sendOne(new SingleMessageSendingRequest(message));  //메시지 발송 요청
    }
}
