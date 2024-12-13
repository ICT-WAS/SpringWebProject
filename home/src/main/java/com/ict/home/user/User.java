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
public class User extends BaseTimeEntity { //아이디, 유저이름, 패스워드, 상태,
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = true)  //소셜 로그인의 경우 null, 일반 로그인일 경우 null 일 시 예외 호출
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private UserStatus status;

    @Column(nullable = true, unique = true)  //소셜 로그인의 경우 null, 일반 로그인일 경우 null 일 시 예외 호출
    private String phoneNumber;

    @Column(nullable = true, unique = true)  //소셜 로그인의 경우 null, 일반 로그인일 경우 null 일 시 예외 호출
    private String email;

    @Column(nullable = true)  //최초 회원가입 시 null 가능 -> 자동로그인 구현하면 notNull 설정 변경 예정
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
    public void createUser(String username, String email, boolean isSocial) {
        this.username = username;
        this.email = email;
        this.password = null;
        this.phoneNumber = null;
        this.status = UserStatus.ACTIVE;  //회원가입 시 자동 활성화
        this.userVerify = UserVerify.UNVERIFIED;
        this.IsSocial=isSocial;
    }

//    @PrePersist
//    public void prePersist() {
//        if (lastLogin == null) {
//            lastLogin = LocalDateTime.now();
//        }
//    }
}
