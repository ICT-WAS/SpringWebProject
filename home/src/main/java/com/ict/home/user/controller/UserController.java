package com.ict.home.user.controller;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.user.dto.PostLoginReq;
import com.ict.home.user.dto.PostLoginRes;

import com.ict.home.user.dto.PostUserReq;
import com.ict.home.user.dto.PostUserRes;
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
        try{
            return new BaseResponse<>(userService.localLogin(postLoginReq, response));
        } catch(BaseException exception) {
            return new BaseResponse<>(exception.getStatus());
        }
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public BaseResponse<String> logout(HttpServletRequest request, HttpServletResponse response) {
        try{
            return new BaseResponse<>(userService.logout(request, response));
        } catch (BaseException exception){
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
        try{
            return new BaseResponse<>(userService.createAccessToken(userId));
        } catch(BaseException exception) {
            return new BaseResponse<>((exception.getStatus()));
        }
    }
}
