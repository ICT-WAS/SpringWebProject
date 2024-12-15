package com.ict.home.condition.dto;

import com.ict.home.condition.enumeration.AccountType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter @Setter @ToString
public class AccountDTO {

    @Schema(description = "고유 pk")
    private Long accountId;

    @Schema(description = "회원 고유 pk")
    private Long userId; // User 엔티티와 관계가 있지만, DTO에서는 userId만 전달

    @Schema(description = "청약통장종류")
    private AccountType type;

    @NotNull
    @Schema(description = "청약통장가입일")
    private LocalDate createdAt;

    @Schema(description = "납입횟수")
    private Integer paymentCount;

    @Schema(description = "총 납입금액 (단위:만원)")
    private Integer totalAmount;

    @Schema(description = "납입인정금액 (단위:만원)")
    private Integer recognizedAmount;

    @NotNull
    @Schema(description = "통장명의 (1: 본인, 2: 배우자)")
    private Integer relationship;
}
