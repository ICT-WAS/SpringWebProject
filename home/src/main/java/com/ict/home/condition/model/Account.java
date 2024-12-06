package com.ict.home.condition.model;


import com.ict.home.condition.enumeration.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Schema(title = "청약통장")
public class Account {

    @Schema(description = "고유 pk")
    private Long accountId;

    @Schema(description = "회원 고유 pk")
    private Long memberId;

    @Schema(description = "청약통장종류")
    private AccountType type;

    @Schema(description = "청약통장가입일")
    private LocalDate createdAt;

    @Schema(description = "납입횟수")
    private Integer paymentCount;

    @Schema(description = "총 납입금액 (단위:만원)")
    private Integer totalAmount;

    @Schema(description = "납입인정금액 (단위:만원)")
    private Integer recognizedAmount;

    @Schema(description = "통장명의 (1: 본인, 2: 배우자)")
    private Integer relationship;
}
