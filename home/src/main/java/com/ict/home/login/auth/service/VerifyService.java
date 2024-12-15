package com.ict.home.login.auth.service;

import com.ict.home.exception.BaseException;
import com.ict.home.login.auth.enums.VerificationType;
import com.ict.home.login.auth.model.Verification;
import com.ict.home.login.auth.repository.VerificationRepository;
import com.ict.home.user.User;
import com.ict.home.util.SmsCertificationUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    //인증 코드 생성
    String verificationCode = createVerificationCode();

    //인증 코드 만료시간 설정(10분)
    LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

    public String sendVerificationCode(String email, String phoneNumber, VerificationType verificationType) throws MessagingException {

        Verification verification = new Verification();

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

    //이메일 발송 메서드
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

    //인증 코드 생성 메서드
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

    //인증 코드 만료 확인
    public boolean isVerificationCodeExpired(Verification verification) {
        if (verification == null || !verification.getExpirationDate().isBefore(LocalDateTime.now())) {
            //인증 코드가 없거나 만료일이 현재 시간 이후일 시
            throw new BaseException(CODE_EXPIRED);
        }
        return true;
    }

    /**
     * 인증 이메일 발송
     */
    @Transactional
    public String sendVerificationCodeByEmail(String email) throws MessagingException {

        Verification verification = new Verification();

        Verification existingVerification = verificationRepository.findByEmailAndVerificationCode(email, verificationCode).orElse(null);

        //기존 정보가 있고 인증 여부가 false 일 시
        if (existingVerification != null && !existingVerification.isVerified()) {
            verificationRepository.delete(existingVerification);  // 기존 이메일 인증 정보 삭제
        } else if(existingVerification != null){
            //기존 정보가 있고 인증 여부도 true 일 시 -> 인증 회원의 칼럼일시
            verificationCode=createVerificationCode();  //새로운 인증 코드를 세팅
        }

        //인증 정보 테이블 저장
        verification.setEmail(email);
        verification.setVerificationCode(verificationCode);
        verification.setExpirationDate(expiresAt);

        verificationRepository.save(verification);  //인증 정보 저장

        sendEmailVerification(email, verificationCode);  //이메일 발송

        return verificationCode;
    }

    /**
     * 인증 문자 발송
     */
    @Transactional
    public String sendVerificationCodeByMobile(String phoneNumber) throws MessagingException {

        Verification verification = new Verification();

        Verification existingVerification = verificationRepository.findByPhoneNumberAndVerificationCode(phoneNumber, verificationCode).orElse(null);

        //기존 정보가 있고 인증 여부가 false 일 시
        if (existingVerification != null && !existingVerification.isVerified()) {
            verificationRepository.delete(existingVerification);  // 기존 핸드폰 인증 정보 삭제
        } else if(existingVerification != null){
            //기존 정보가 있고 인증 여부도 true 일 시 -> 인증 회원의 칼럼일 시
            verificationCode=createVerificationCode();  //새로운 인증 코드를 세팅
        }

        //인증 정보 테이블 저장
        verification.setPhoneNumber(phoneNumber);
        verification.setVerificationCode(verificationCode);
        verification.setExpirationDate(expiresAt);

        verificationRepository.save(verification);  //인증 정보 저장

        sendPhoneVerification(phoneNumber, verificationCode);  //문자 발송

        return verificationCode;
    }
}


