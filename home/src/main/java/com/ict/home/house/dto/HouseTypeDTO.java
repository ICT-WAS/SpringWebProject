package com.ict.home.house.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Schema(title = "주택청약 공고 상세 페이지에서 보여줄 하나의 주택타입 dto")
public class HouseTypeDTO {

    private String typeName; // 타입명  ex) 084.8182C

    private Integer normalSupply; // 일반 공급 수

    /*
        여기서부터는 일반 공고만 01만 가지고 있음
     */

    private Integer specialSupply; // 특별 공급 수

    @Schema(description = "특별공급-다자녀가구 세대수")
    private Integer mnychHshldco;

    @Schema(description = "특별공급-신혼부부 세대수")
    private Integer nwwdsHshldco;

    @Schema(description = "특별공급-생애최초 세대수")
    private Integer lfeFrstHshldco;

    @Schema(description = "특별공급-노부모부양 세대수")
    private Integer oldParntsSuportHshldco;

    @Schema(description = "특별공급-기관추천 세대수")
    private Integer insttRecomendHshldco;

    @Schema(description = "특별공급-기타 세대수")
    private Integer etcHshldco;

    @Schema(description = "특별공급-이전기관 세대수")
    private Integer transrInsttEnfsnHshldco;

    @Schema(description = "특별공급-청년 세대수")
    private Integer ygmnHshldco;

    @Schema(description = "특별공급-신생아 세대수")
    private Integer nwbbHshldco;

    @Schema(description = "공급금액(분양최고금액) (단위:만원)")
    private Integer price;
}
