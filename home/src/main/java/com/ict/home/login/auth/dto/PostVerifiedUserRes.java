package com.ict.home.login.auth.dto;

import com.ict.home.user.enums.UserVerify;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PostVerifiedUserRes {
    private String verifiedData;
    private String userVerify;
}
