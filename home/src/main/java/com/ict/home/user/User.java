package com.ict.home.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

//@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User { //아이디, 유저이름, 패스워드, 상태,
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = true)  //소셜 로그인의 경우 null, 일반 로그인일 경우 null 일 시 예외 호출
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(nullable = true)  //소셜 로그인의 경우 null, 일반 로그인일 경우 null 일 시 예외 호출
    private String phoneNumber;

    @Column(nullable = false)
    private LocalDateTime lastLogin;

//    @PrePersist
//    public void prePersist() {
//        if (lastLogin == null) {
//            lastLogin = LocalDateTime.now();
//        }
//    }
}
