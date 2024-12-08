package com.ict.home.condition.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Schema(title = "조건01")
public class Condition01 {

    @Schema(description = "고유 pk")
    private Long condition01Id;

    @Schema(description = "회원 고유 pk")
    private Long memberId;

    @Schema(description = "신청자 생년월일")
    private LocalDate birthday;

    @Schema(description = "현재 거주지역 시/도")
    private String siDo;

    @Schema(description = "현재거주지역 군/구")
    private String gunGu;

    @Schema(description = "입주 일자")
    private LocalDate transferDate;

    @Schema(description = "현재 지역 입주일")
    private LocalDate regionMoveInDate;

    @Schema(description = "수도권 입주일")
    private LocalDate metropolitanAreaDate;

    @Schema(description = "세대주 여부(0: 세대원, 1: 세대주)")
    private Integer houseHolder;

    @Schema(description = "결혼 여부(0: 미혼, 1: 기혼, 2: 예비신혼부부, 3: 한부모)")
    private Integer married;

    @Schema(description = "혼인 신고일")
    private LocalDate marriedDate;
}
