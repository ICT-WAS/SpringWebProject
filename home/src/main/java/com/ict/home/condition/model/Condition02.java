package com.ict.home.condition.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Schema(title = "조건02")
public class Condition02 {

    @Schema(description = "고유 pk")
    private Long condition02Id;

    @Schema(description = "회원 고유 pk")
    private Long memberId;

    @Schema(description = "본인 또는 배우자의 증, 조부모 동거여부(0: x / 1: o)")
    private Integer grandparents;

    @Schema(description = "본인 또는 배우자의 부모님 동거여부(0: x / 1: o)")
    private Integer parents;

    @Schema(description = "자녀(태아 포함)와 동거 여부(0: x / 1: o)")
    private Integer child;

    @Schema(description = "부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀와 동거 여부(0: x / 1: o)")
    private Integer grandchildren;

    @Schema(description = "배우자와 동거 여부(0: x / 1: o)")
    private Integer spouse;

    @Schema(description = "사위 또는 며느리와 동거 여부(0: x / 1: o)")
    private Integer in_laws;

}
