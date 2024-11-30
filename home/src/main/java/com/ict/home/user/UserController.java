package com.ict.home.user;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.user.dto.PostUserReq;
import com.ict.home.user.dto.PostUserRes;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping
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

}
