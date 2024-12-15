package com.ict.home.condition.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter @Setter @ToString
public class Condition01DTO {

    @Schema(description = "고유 pk")
    private Long condition01Id;

    @Schema(description = "회원 고유 pk")
    private Long userId; // User 엔티티와 관계가 있지만, DTO에서는 userId만 전달

    @NotNull
    @Schema(description = "신청자 생년월일")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @NotNull
    @Schema(description = "현재 거주지역 시/도")
    private String siDo;

    @NotNull
    @Schema(description = "현재거주지역 군/구")
    private String gunGu;

    @NotNull
    @Schema(description = "입주 일자")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate transferDate;

    @Schema(description = "현재 지역 입주일")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate regionMoveInDate;

    @Schema(description = "수도권 입주일")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate metropolitanAreaDate;

    @NotNull
    @Schema(description = "세대주 여부(N: 세대원, Y: 세대주)")
    private Boolean isHouseHolder;

    @NotNull
    @Schema(description = "결혼 여부(0: 미혼, 1: 기혼, 2: 예비신혼부부, 3: 한부모)")
    private Integer married;

    @Schema(description = "혼인 신고일")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate marriedDate;
}
