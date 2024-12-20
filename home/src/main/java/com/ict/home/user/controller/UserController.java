package com.ict.home.user.controller;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.login.auth.dto.PostVerifiedUserRes;
import com.ict.home.user.dto.*;

import com.ict.home.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("test")
    public String userTest() {
        return "cors 유저 테스트";
    }

    /**
     * 회원가입
     */
    @PostMapping("")
    public BaseResponse<PostUserRes> createUser(@RequestBody @Valid PostUserReq postUserReq) {
        try {
            return new BaseResponse<>(userService.createUser(postUserReq));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public BaseResponse<PostLoginRes> login(@RequestBody @Valid PostLoginReq postLoginReq, HttpServletResponse response) {
        try {
            return new BaseResponse<>(userService.localLogin(postLoginReq, response));
        } catch (BaseException exception) {
            return new BaseResponse<>(exception.getStatus());
        }
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public BaseResponse<String> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            return new BaseResponse<>(userService.logout(request, response));
        } catch (BaseException exception) {
            return new BaseResponse<>(exception.getStatus());
        }
    }

    /**
     * 비동기 처리를 위한 email & phoneNumber 중복 체크
     */
    @GetMapping("/check/email")
    public boolean checkEmail(@RequestParam("email") String email) {
        return userService.checkEmailExists(email);
    }

    @GetMapping("/check/phone")
    public boolean checkPhoneNumber(@RequestParam("phone") String phone) {
        return userService.checkPhoneNumberExists(phone);
    }

    @GetMapping("/check/username")
    public boolean checkUsername(@RequestParam("username") String username) {
        return userService.checkUsernameExists(username);
    }

    /**
     * 액세스 토큰을 재발급하기 위한 엔드포인트
     */
    @PostMapping("/check/access-token/reset")
    public BaseResponse<String> resetAccessToken(@RequestParam("userId") Long userId) {
        try {
            return new BaseResponse<>(userService.createAccessToken(userId));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * 인증된 핸드폰 번호로 이메일 찾기
     */
    @PostMapping("/find/email")
    public BaseResponse<String> findEmail(@RequestBody PostFindEmailReq postFindEmailReq) {
        try {
            String phoneNumber = postFindEmailReq.getPhoneNumber();
            return new BaseResponse<>(userService.findEmailByPhoneNumber(phoneNumber));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * email 로 인증 정보 찾기
     */
    @PostMapping("/find/verification")
    public BaseResponse<PostVerifiedUserRes> findVerifiedUserByEmail(@RequestBody String email) {
        try {
            return new BaseResponse<>(userService.getVerifiedUserByEmail(email));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * 비밀번호 재설정
     */
    @PostMapping("/reset/password")
    public BaseResponse<?> resetPassword(@RequestBody @Valid PostResetPasswordReq postResetPasswordReq) {
        try {
            return new BaseResponse<>(userService.resetPassword(postResetPasswordReq));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * 유저 정보 조회
     */
    @GetMapping("")
    public BaseResponse<?> getUserinfo(@RequestParam(name = "userId") Long userId) {
        try {
            return new BaseResponse<>(userService.getUserInfoDetails(userId));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * 유저 정보 업데이트
     */
    @PostMapping("/update")
    public BaseResponse<?> UpdateUserInfo(@RequestBody @Valid PostUpdateUserInfoReq postUpdateUserInfoReq) {
        try {
            return new BaseResponse<>(userService.updateUserInfo(postUpdateUserInfoReq));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }

    /**
     * 회원 탈퇴
     */
    @PostMapping("delete")
    public BaseResponse<?> setUserStateInactive(@RequestParam(name = "userId") Long userId, HttpServletResponse response) {
        try {
            return new BaseResponse<>(userService.setUserStateInactive(userId, response));
        } catch (BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }
}
