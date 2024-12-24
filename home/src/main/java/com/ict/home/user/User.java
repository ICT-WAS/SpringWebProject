package com.ict.home.user;

import com.ict.home.user.enums.UserStatus;
import com.ict.home.user.enums.UserVerify;
import com.ict.home.util.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.type.YesNoConverter;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseTimeEntity {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = true)  //소셜 로그인의 경우 null
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private UserStatus status;

    @Column(nullable = true, unique = true)  //소셜 로그인의 경우 null
    private String phoneNumber;

    @Column(nullable = true, unique = true)  //소셜 로그인의 경우 null
    private String email;

    @Column(nullable = true)
    private LocalDateTime lastLogin;

    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private UserVerify userVerify;

    @Convert(converter = YesNoConverter.class)
    private boolean IsSocial;

    //로컬 회원가입
    public void createUser(String username, String email, String password, String phoneNumber) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.status = UserStatus.ACTIVE;  //회원가입 시 자동 활성화
        this.userVerify = UserVerify.UNVERIFIED;
        this.IsSocial=false;
    }

    //소셜 회원가입
    public void createUser(String username, boolean isSocial) {
        this.username = username;
        this.email = null;
        this.password = null;
        this.phoneNumber = null;
        this.status = UserStatus.ACTIVE;  //회원가입 시 자동 활성화
        this.userVerify = UserVerify.UNVERIFIED;
        this.IsSocial=isSocial;
    }
}
