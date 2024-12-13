package com.ict.home.login.model;

import com.ict.home.user.User;
import com.ict.home.util.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SocialAccount extends BaseTimeEntity {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //여러개의 SocialAccount 테이블이 하나의 User 참조 가능
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String provider;

    @Column(nullable = false, unique = true)
    private String providerUserId;

}
