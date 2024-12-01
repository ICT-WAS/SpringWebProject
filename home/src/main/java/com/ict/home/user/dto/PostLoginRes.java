package com.ict.home.user.dto;

import com.ict.home.login.dto.JwtResponseDto;
import com.ict.home.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 로그인 성공 시 응답 데이터 - userId, 액세스 토큰, 리프레시 토큰
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostLoginRes {
    private Long UserId;
    private String accessToken;
    private String refreshToken;

    public PostLoginRes(User user, JwtResponseDto jwtResponseDto) {
        this.UserId = user.getId();
        this.accessToken = jwtResponseDto.getAccessToken();
        this.refreshToken = jwtResponseDto.getRefreshToken();
    }
}
