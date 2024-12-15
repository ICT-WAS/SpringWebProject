package com.ict.home.login.auth.controller;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.login.auth.dto.PostEmailVerificationReq;
import com.ict.home.login.auth.dto.PostMobileVerificationReq;
import com.ict.home.login.auth.dto.PostSignupAuthReq;
import com.ict.home.login.auth.dto.PostVerifyAuthReq;
import com.ict.home.login.auth.model.Verification;
import com.ict.home.login.auth.enums.VerificationType;
import com.ict.home.login.auth.repository.VerificationRepository;
import com.ict.home.login.auth.service.VerifyService;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import com.ict.home.user.service.UserService;
import com.ict.home.user.service.UserUtilService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import static com.ict.home.exception.BaseResponseStatus.CODE_EXPIRED;

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
    @Autowired
    private UserUtilService userUtilService;

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
            return new BaseResponse<>(CODE_EXPIRED);
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

    @PostMapping("/verify/email")  //본인확인용
    public BaseResponse<?> verifyCodeWithEmail(@RequestBody PostEmailVerificationReq postEmailVerificationReq) {

        Verification verification = null;
        try {
            verification = verificationRepository.findByEmailAndVerificationCode(postEmailVerificationReq.getEmail(), postEmailVerificationReq.getVerificationCode()).orElse(null);
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }

        //인증 코드 만료 확인
        if (verification != null && verification.getExpirationDate().isBefore(LocalDateTime.now())) {
            return new BaseResponse<>(CODE_EXPIRED);
        }

        //인증 완료 처리 - 임시 인증이기 때문에 인증이 되었어도 인증 여부 칼럼은 false 고정
        if (verification != null) {
            //인증완료 시 만료시간을 현재 시간으로 지정
            verification.setExpirationDate(LocalDateTime.now());
            //데이터베이스에 저장
            verificationRepository.save(verification);
        }

        User user = userUtilService.findByEmailWithValidation(postEmailVerificationReq.getEmail());

        return new BaseResponse<>(user);
    }

    @PostMapping("/verify/mobile")  //본인확인용
    public BaseResponse<?> verifyCodeWithMobile(@RequestBody PostMobileVerificationReq postMobileVerificationReq) {

        Verification verification = null;
        try {
            verification = verificationRepository.findByEmailAndVerificationCode(postMobileVerificationReq.getPhoneNumber(), postMobileVerificationReq.getVerificationCode()).orElse(null);
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }

        //인증 코드 만료 확인
        if (verification != null && verification.getExpirationDate().isBefore(LocalDateTime.now())) {
            return new BaseResponse<>(CODE_EXPIRED);
        }

        //인증 완료 처리 - 임시 인증이기 때문에 인증이 되었어도 인증 여부 칼럼은 false 고정
        if (verification != null) {
            //인증완료 시 만료시간을 현재 시간으로 지정
            verification.setExpirationDate(LocalDateTime.now());
            //데이터베이스에 저장
            verificationRepository.save(verification);
        }

        User user = userUtilService.findByEmailWithValidation(postMobileVerificationReq.getPhoneNumber());

        return new BaseResponse<>(user);
    }
}
