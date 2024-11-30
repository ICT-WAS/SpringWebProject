package com.ict.home.user.dto;

import com.ict.home.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 Response Dto
 * 자동로그인 검토 중
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PostUserRes {
    private Long userId;
    private String username;

    public PostUserRes(User user) {
        this.userId = user.getId();
        this.username = user.getUsername();
    }
}
