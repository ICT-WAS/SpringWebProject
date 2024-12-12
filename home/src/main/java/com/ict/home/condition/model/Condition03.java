package com.ict.home.condition.model;

import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.*;
import org.hibernate.type.YesNoConverter;

import java.time.LocalDate;

@Entity
@Table(name = "condition03")
@Getter
@Setter
@ToString
@Schema(title = "조건03")
@AllArgsConstructor
@NoArgsConstructor
public class Condition03 {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition03_id")
    private Long condition03Id;

    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User user;

    @NotNull
    @Schema(description = "차량 가액 (단위: 만원)")
    @Column(name = "car_price", nullable = false)
    private Integer carPrice;

    @NotNull
    @Schema(description = "부동산(건물+토지) 총 가액 (0: 미보유 혹은 2억 1,150만원 이하, 1: 2억 1,150만원 초과 3억 3,100만원 이하, 3: 3억 3,100만원 초과)")
    @Column(name = "property_price", nullable = false)
    private Integer propertyPrice;

    @NotNull
    @Schema(description = "세대구성원 총 자산 (단위: 만원)")
    @Column(name = "total_asset", nullable = false)
    private Integer totalAsset;

    @NotNull
    @Schema(description = "본인의 총 자산 (단위: 만원)")
    @Column(name = "my_asset", nullable = false)
    private Integer myAsset;

    @Schema(description = "배우자의 총 자산 (단위: 만원)")
    @Column(name = "spouse_asset", nullable = true)
    private Integer spouseAsset;

    @NotNull
    @Schema(description = "세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액 (단위: 만원)")
    @Column(name = "family_average_monthly_income", nullable = false)
    private Integer familyAverageMonthlyIncome;

    @NotNull
    @Schema(description = "전년도 월 평균 소득 (단위: 만원)")
    @Column(name = "previous_year_average_monthly_income", nullable = false)
    private Integer previousYearAverageMonthlyIncome;

    @Schema(description = "소득활동 여부 (0: 외벌이 / 1: 맞벌이)")
    @Column(name = "income_activity", nullable = true)
    private Integer incomeActivity;

    @Schema(description = "배우자의 월 평균 (단위: 만원)")
    @Column(name = "spouse_average_monthly_income", nullable = true)
    private Integer spouseAverageMonthlyIncome;

    @NotNull
    @Schema(description = "소득세 납부 기간 (단위: 년)")
    @Column(name = "income_tax_payment_period", nullable = false)
    private Integer incomeTaxPaymentPeriod;

    @Schema(description = "세대구성원 혹은 본인의 과거 주택청약 당첨 여부 (가장 최근에 당첨된 날짜 / 없으면 null)")
    @Column(name = "last_winned", nullable = true)
    private LocalDate lastWinned;

    @Schema(description = "본인의 주택청약 당첨 후 부적격 여부 (부적격자 판정된 날짜 / 없으면 null)")
    @Column(name = "ineligible", nullable = true)
    private LocalDate ineligible;
}
