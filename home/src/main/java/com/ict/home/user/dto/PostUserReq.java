package com.ict.home.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원가입 Request DTO
 * 스프링 제공 validation 기능을 사용하여 유효성검사를 진행
 * User Entity 에서는 null 허용, 회원가입시에는 NotNull 필드로 지정
 * 차후 컨트롤러에서 @Valid 설정을 추가하면 유효성 검사 가능!
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostUserReq {

    @NotNull(message = "사용자 이름은 필수 항목입니다.")
    @Size(min = 2, max = 12, message = "사용자 이름은 2자 이상 12자 이하로 입력해주세요.")
    private String username;  //사용자가 입력한 아이디, 닉네임

    @NotNull(message = "이메일은 필수 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")  //스프링이 제공하는 이메일 유효성 검증
    private String email;

    @NotNull(message = "비밀번호는 필수 항목입니다.")
    @Size(min = 8, max = 16, message = "비밀번호는 8자 이상 16자 이하로 입력해주세요.")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$",
            message = "비밀번호는 8자 이상 16자 이하, 대문자 1개 이상, 숫자 1개 이상, 특수문자(!@#$%^&*) 1개 이상 포함해야 합니다.")
    private String password;

    @NotNull(message = "휴대전화 번호는 필수 항목입니다.")
    @Pattern(regexp = "^01([0-9])-([0-9]{3,4})-([0-9]{4})$", message = "유효한 전화번호 형식을 입력해주세요.")  //스프링이 제공하는 패턴 검증
    private String phoneNumber;
}
