package com.ict.home.login.auth.service;

import com.ict.home.exception.BaseException;
import com.ict.home.login.auth.VerifyEnum.VerificationType;
import com.ict.home.login.auth.entity.Verification;
import com.ict.home.login.auth.repository.VerificationRepository;
import com.ict.home.util.SmsCertificationUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import static com.ict.home.exception.BaseResponseStatus.*;

@Service
public class VerifyService {

    @Autowired
    private VerificationRepository verificationRepository;
    @Autowired
    private SmsCertificationUtil smsCertificationUtil;
    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.username}")
    private String username;

    public String sendVerificationCode(String email, String phoneNumber, VerificationType verificationType) throws MessagingException {
        //인증 코드 생성
        String verificationCode = createVerificationCode();

        //인증 코드 만료시간 설정(3분)
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(3);

        Verification verification = new Verification();

        //기존 인증 정보가 있을 시 해당 행 삭제
        if (verificationType == VerificationType.EMAIL) {
            Verification existingVerification = verificationRepository.findByEmailAndVerificationCode(email, verificationCode).orElse(null);
            //기존 정보가 있고 인증 여부가 false 일 시
            if (existingVerification != null && !existingVerification.isVerified()) {
                verificationRepository.delete(existingVerification);  // 기존 이메일 인증 정보 삭제
            }

            verification.setEmail(email);
        } else if (verificationType == VerificationType.PHONE) {
            Verification existingVerification = verificationRepository.findByPhoneNumberAndVerificationCode(phoneNumber, verificationCode).orElse(null);
            //기존 정보가 있고 인증 여부가 false 일 시
            if (existingVerification != null && !existingVerification.isVerified()) {
                verificationRepository.delete(existingVerification);  // 기존 휴대폰 인증 정보 삭제
            }
            verification.setPhoneNumber(phoneNumber);
        }

        //인증 정보 테이블 저장
        verification.setVerificationCode(verificationCode);
        verification.setVerificationType(verificationType);
        verification.setExpirationDate(expiresAt);

        verificationRepository.save(verification);  //인증 정보 저장

        if (verificationType == VerificationType.EMAIL) {
            sendEmailVerification(email, verificationCode);
        } else if (verificationType == VerificationType.PHONE) {
            sendPhoneVerification(phoneNumber, verificationCode);
        }
        return verificationCode;
    }

    //넘어온 휴대전화 정보에 "-" 기호를 지움
    public String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        return phoneNumber.replace("-", "");
    }

    private void sendPhoneVerification(String phoneNumber, String verificationCode) {
        //핸드폰 발송 로직(SMS API 연동)
        String formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        smsCertificationUtil.sendSMS(formattedPhoneNumber, verificationCode);
    }

    public void sendEmailVerification(String email, String verificationCode) throws MessagingException {
        //메일 제목 설정
        String subject = "[청약이지] 이메일 인증을 완료해주세요.";
        //인증 api 엔드포인트 설정
        //메일 본문 설정
        String content = "<p>안녕하세요, '청약이지' 입니다.</p>"
                + "<p>아래 인증 코드를 입력하여 이메일 인증을 완료해주세요.</p>"
                + "<p><strong>인증 코드: <span style='font-size: 24px;'>" + verificationCode + "</span></strong></p>"
                + "<p>감사합니다.</p>";

        //이메일 메시지 생성 클래스
        MimeMessage message = mailSender.createMimeMessage();
        //true: 이미지 본문에 HTML 허용
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        try {
            helper.setFrom(username);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new BaseException(EMAIL_SENDING_FAILED);
        }

    }

    public String createVerificationCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder(6);  // 6자리 인증 코드

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        }
        return code.toString();
    }
}

//    배포라면... 가능했을지도...
//    public void sendEmailVerification(String email, String verificationCode) throws MessagingException {
//        //메일 제목 설정
//        String subject = "[청약이지] 이메일 인증을 완료해주세요.";
//        //인증 api 엔드포인트 설정
//        String verificationUrl = "http://localhost:8989/auth/verify/email?code=" + verificationCode;
//        //메일 본문 설정
//        String content = "<p>아래 버튼을 클릭하면 인증이 완료됩니다.</p>"
//                + "<a href='" + verificationUrl + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;'>이메일 인증</a>";
//
//        //이메일 메시지 생성 클래스
//        MimeMessage message = mailSender.createMimeMessage();
//        //true: 이미지 본문에 HTML 허용
//        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//        try {
//            helper.setFrom(username);
//            helper.setTo(email);
//            helper.setSubject(subject);
//            helper.setText(content, true);
//
//            mailSender.send(message);
//        } catch (MessagingException e) {
//            throw new BaseException(EMAIL_SENDING_FAILED);
//        }
//    }


