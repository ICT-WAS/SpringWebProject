package com.ict.home.user.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PostResetPasswordReq {
    private Long userId;

    @NotNull(message = "비밀번호는 필수 항목입니다.")
    @Size(min = 8, max = 16, message = "비밀번호는 8자 이상 16자 이하로 입력해주세요.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$",
            message = "비밀번호는 8자 이상 16자 이하, 대문자 1개 이상, 숫자 1개 이상, 특수문자(!@#$%^&*) 1개 이상 포함해야 합니다.")
    private String password;
}
