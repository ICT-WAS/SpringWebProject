package com.ict.home.condition.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Schema(title = "세대구성원")
public class Family {

    @Schema(description = "고유 pk")
    private Long familyId;

    @Schema(description = "회원 고유 pk")
    private Long memberId;

    @Schema(description = "관계")
    private String relationship; // https://miro.com/app/board/uXjVLQRFe_4=/ 찾기 '가족관계'

    @Schema(description = "동거여부 (0: 동거x, 1: 동거o, 2: 배우자와 동거o)")
    private Integer livingTogether;

    @Schema(description = "동거기간 (0: 1년 미만, 1: 1년 이상 3년 미만, 2: 3년 이상)")
    private Integer livingTogetherDate;

    @Schema(description = "생년월일")
    private LocalDate birthday;

    @Schema(description = "혼인여부 (0: 혼인x, 1: 혼인o)")
    private Integer isMarried;

    @Schema(description = "주택/분양권 소유 수")
    private Integer houseCount;

    @Schema(description = "주택 처분 날짜")
    private LocalDate houseSoldDate;
}
