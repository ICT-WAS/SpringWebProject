package com.ict.home.login.auth.controller;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.login.auth.dto.PostSignupAuthReq;
import com.ict.home.login.auth.dto.PostVerifyAuthReq;
import com.ict.home.login.auth.entity.Verification;
import com.ict.home.login.auth.VerifyEnum.VerificationType;
import com.ict.home.login.auth.repository.VerificationRepository;
import com.ict.home.login.auth.service.VerifyService;
import com.ict.home.user.UserRepository;
import com.ict.home.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
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
                String verificationCode = verifyService.sendVerificationCode(postSignupAuthReq.getEmail(), "", postSignupAuthReq.getVerificationType());
                return new BaseResponse<>(verificationCode);
            }
            if (postSignupAuthReq.getVerificationType().equals(VerificationType.PHONE)) {
                String verificationCode = verifyService.sendVerificationCode("", postSignupAuthReq.getPhoneNumber(), postSignupAuthReq.getVerificationType());
                return new BaseResponse<>(verificationCode);
            }
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
        return new BaseResponse<>("인증 실패");
    }

    @PostMapping("/verify")
    public BaseResponse<?> verifyCode(@RequestBody PostVerifyAuthReq postVerifyAuthReq) {

        Verification verification = null;
        try {
            if (postVerifyAuthReq.getVerificationType().equals(VerificationType.EMAIL)) {
                verification = verificationRepository.findByEmailAndVerificationCode(postVerifyAuthReq.getEmail(), postVerifyAuthReq.getVerificationCode()).orElse(null);
            }
            if (postVerifyAuthReq.getVerificationType().equals(VerificationType.PHONE)) {
                verification = verificationRepository.findByPhoneNumberAndVerificationCode(postVerifyAuthReq.getPhoneNumber(), postVerifyAuthReq.getVerificationCode()).orElse(null);
            }
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }

        //인증 코드 만료 확인
        if (verification != null && verification.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new BaseException(CODE_EXPIRED);
        }

        //인증 완료 처리
        if (verification != null) {
            //인증 완료 처리
            verification.setVerified(true);
            //인증완료 시 만료시간을 현재 시간으로 지정
            verification.setExpirationDate(LocalDateTime.now());
            //데이터베이스에 저장
            verificationRepository.save(verification);
        }

        return new BaseResponse<>("인증 성공");
    }
}
