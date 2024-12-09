package com.ict.home.login.auth.controller;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.login.auth.dto.PostSignupAuthReq;
import com.ict.home.login.auth.entity.Verification;
import com.ict.home.login.auth.VerifyEnum.VerificationType;
import com.ict.home.login.auth.repository.VerificationRepository;
import com.ict.home.login.auth.service.VerifyService;
import com.ict.home.user.UserRepository;
import com.ict.home.user.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import static com.ict.home.exception.BaseResponseStatus.CODE_EXPIRED;
import static com.ict.home.exception.BaseResponseStatus.INVALID_EMAIL_CODE;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private VerifyService verifyService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationRepository verificationRepository;

    @PostMapping("/signup")
    public BaseResponse<?> signupAuth(@RequestBody PostSignupAuthReq postSignupAuthReq) throws MessagingException {
        try {
            if (postSignupAuthReq.getVerificationType().equals(VerificationType.EMAIL)) {
                verifyService.sendVerificationCode(postSignupAuthReq.getEmail(), "", postSignupAuthReq.getVerificationType());
                return new BaseResponse<>("이메일 발송 완료");
            }
            if (postSignupAuthReq.getVerificationType().equals(VerificationType.PHONE)) {
                verifyService.sendVerificationCode("", postSignupAuthReq.getPhoneNumber(), postSignupAuthReq.getVerificationType());
                return new BaseResponse<>("문자 발송 완료");
            }
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
        return new BaseResponse<>("인증 실패");
    }

    @PostMapping("/verify")
    public BaseResponse<?> verifyCode(@RequestParam String verificationCode) {
        Verification verification = verificationRepository.findByVerificationCode(verificationCode).orElseThrow(() -> new BaseException(INVALID_EMAIL_CODE));

        //인증 코드 만료 확인
        if (verification.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new BaseException(CODE_EXPIRED);
        }

        //인증 완료 처리
        verification.setVerified(true);
        verification.setExpirationDate(LocalDateTime.now());  //인증완료 시 만료시간을 현재 시간으로 지정
        verificationRepository.save(verification);

        return new BaseResponse<>("인증 성공");
    }
}
