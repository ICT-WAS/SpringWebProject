package com.ict.home.condition.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter @Setter @ToString
public class Condition03DTO {

    @Schema(description = "고유 pk")
    private Long condition03Id;

    @Schema(description = "회원 고유 pk")
    private Long userId;

    @NotNull
    @Schema(description = "차량 가액 (단위: 만원)")
    private Integer carPrice;

    @NotNull
    @Schema(description = "부동산(건물+토지) 총 가액 (0: 미보유 혹은 2억 1,150만원 이하, 1: 2억 1,150만원 초과 3억 3,100만원 이하, 3: 3억 3,100만원 초과)")
    private Integer propertyPrice;

    @NotNull
    @Schema(description = "세대구성원 총 자산 (단위: 만원)")
    private Integer totalAsset;

    @NotNull
    @Schema(description = "본인의 총 자산 (단위: 만원)")
    private Integer myAsset;

    @Schema(description = "배우자의 총 자산 (단위: 만원)")
    private Integer spouseAsset;

    @NotNull
    @Schema(description = "세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액 (단위: 만원)")
    private Integer familyAverageMonthlyIncome;

    @NotNull
    @Schema(description = "본인의 전년도 월 평균 소득 (단위: 만원)")
    private Integer previousYearAverageMonthlyIncome;

    @Schema(description = "소득활동 여부 (0: 외벌이 / 1: 맞벌이)")
    private Integer incomeActivity;

    @Schema(description = "배우자의 월 평균 (단위: 만원)")
    private Integer spouseAverageMonthlyIncome;

    @NotNull
    @Schema(description = "소득세 납부 기간 (단위: 년)")
    private Integer incomeTaxPaymentPeriod;

    @Schema(description = "세대구성원 혹은 본인의 과거 주택청약 당첨 여부 (가장 최근에 당첨된 날짜 / 없으면 null)")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastWinned;

    @Schema(description = "본인의 주택청약 당첨 후 부적격 여부 (부적격자 판정된 날짜 / 없으면 null)")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ineligible;
}
