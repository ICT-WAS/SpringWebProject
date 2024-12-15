package com.ict.home.condition.model;


import com.ict.home.condition.enumeration.AccountType;
import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "account")
@Getter
@Setter
@ToString
@Schema(title = "청약통장")
@AllArgsConstructor
@NoArgsConstructor
public class Account {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @Schema(description = "청약통장종류")
    @Column(name = "type", nullable = true)
    @Enumerated(EnumType.STRING)
    private AccountType type;

    @NotNull
    @Schema(description = "청약통장가입일")
    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @Schema(description = "납입횟수")
    @Column(name = "payment_count", nullable = true)
    private Integer paymentCount;

    @Schema(description = "총 납입금액 (단위:만원)")
    @Column(name = "total_amount", nullable = true)
    private Integer totalAmount;

    @Schema(description = "납입인정금액 (단위:만원)")
    @Column(name = "recognized_amount", nullable = true)
    private Integer recognizedAmount;

    @NotNull
    @Schema(description = "통장명의 (1: 본인, 2: 배우자)")
    @Column(name = "relationship", nullable = false)
    private Integer relationship;
}
