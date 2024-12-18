package com.ict.home.house.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@Schema(title = "주택청약 공고 상세 페이지에 넘겨줄 상세정보 dto")
public class HouseDetailInfoDTO {
    // detail의 공용 MODEL_NO(모델번호), HOUSE_TY(주택형), SUPLY_HSHLDCO(일반공급세대수), LTTOT_TOP_AMOUNT(공급금액(분양최고금액) (단위:만원))

    private String houseType; // 1개의 타입이 여러 HouseTypeDTO를 가지고 있음

    private List<HouseTypeDTO> houseTypeDTOList = new ArrayList<>();

    private Integer normalSupply = 0; // 일반 공급 수

    private Integer maxPrice;

    private Integer minPrice;

    /*
       여기서부터는 일반 공고만 01만 가지고 있음
    */

    private Integer specialSupply=0; // 특별 공급 수, 04일시 0개

    @Schema(description = "특별공급-다자녀가구 세대수")
    private Integer mnychHshldco = 0;

    @Schema(description = "특별공급-신혼부부 세대수")
    private Integer nwwdsHshldco = 0;

    @Schema(description = "특별공급-생애최초 세대수")
    private Integer lfeFrstHshldco = 0;

    @Schema(description = "특별공급-노부모부양 세대수")
    private Integer oldParntsSuportHshldco = 0;

    @Schema(description = "특별공급-기관추천 세대수")
    private Integer insttRecomendHshldco = 0;

    @Schema(description = "특별공급-기타 세대수")
    private Integer etcHshldco = 0;

    @Schema(description = "특별공급-이전기관 세대수")
    private Integer transrInsttEnfsnHshldco = 0;

    @Schema(description = "특별공급-청년 세대수")
    private Integer ygmnHshldco = 0;

    @Schema(description = "특별공급-신생아 세대수")
    private Integer nwbbHshldco = 0;
}
