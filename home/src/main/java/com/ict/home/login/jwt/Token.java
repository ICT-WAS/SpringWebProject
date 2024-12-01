package com.ict.home.login.jwt;

import com.ict.home.user.User;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


//@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Token {
    @Column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tokenId; // 토큰의 식별자

    @Column(nullable = true)
    private String refreshToken;

    @Column(nullable = true)
    private LocalDateTime expirationDate;  //만료일

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //리프레시 토큰 업데이트
    public void updateRefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }

    //User 업데이트
    public void updateUser(User user){
        this.user = user;
    }

    //만료일 업데이트
    public void updateExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    //만료일 확인 - 만료일이 지금보다 이후일 시 true(지금보다 이전이거나 널이 아닐 시 true)
    public boolean isExpired() {
        return expirationDate != null && expirationDate.isBefore(LocalDateTime.now());
    }
}