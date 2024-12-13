package com.ict.home.login.auth.model;

import com.ict.home.login.auth.enums.VerificationType;
import com.ict.home.util.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Verification extends BaseTimeEntity {
    //인증을 위한 테이블, email or phoneNumber 로 확인

    @Column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String verificationCode;

    private String email;

    private String phoneNumber;

    @Enumerated(EnumType.ORDINAL)
    private VerificationType verificationType;

    @Column(nullable = true)
    private LocalDateTime expirationDate;  //만료일

    private boolean isVerified;

    //만료일 업데이트
    public void updateExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    //만료일 확인 - 만료일이 지금보다 이전일 시 true(지금보다 이전이거나 널이 아닐 시 true)
    public boolean isExpired() {
        return expirationDate != null && expirationDate.isBefore(LocalDateTime.now());
    }
}
