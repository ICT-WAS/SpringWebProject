package com.ict.home.house.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@ToString
@Schema(title = "주택청약 공고 상세정보")
public class Detail {

    @Schema(description = "고유 pk")
    private Long detailId;

    @Schema(description = "주택청약 공고 고유 pk")
    private Long houseId;

    @Schema(description = "모델번호 / MODEL_NO")
    private Integer modelNo;

    @Schema(description = "주택형 / HOUSE_TY")
    private String houseTy;

    @Schema(description = "공급면적 / SUPLY_AR")
    private BigDecimal suplyAr;

    @Schema(description = "일반공급세대수 / SUPLY_HSHLDCO")
    private Integer suplyHshldco;

    @Schema(description = "특별공급세대수 / SPSPLY_HSHLDCO")
    private Integer spsplyHshldco;

    @Schema(description = "특별공급-다자녀가구 세대수 / MNYCH_HSHLDCO")
    private Integer mnychHshldco;

    @Schema(description = "특별공급-신혼부부 세대수 / NWWDS_HSHLDCO")
    private Integer nwwdsHshldco;

    @Schema(description = "특별공급-생애최초 세대수 / LFE_FRST_HSHLDCO")
    private Integer lfeFrstHshldco;

    @Schema(description = "특별공급-노부모부양 세대수 / OLD_PARNTS_SUPORT_HSHLDCO")
    private Integer oldParntsSuportHshldco;

    @Schema(description = "특별공급-기관추천 세대수 / INSTT_RECOMEND_HSHLDCO")
    private Integer insttRecomendHshldco;

    @Schema(description = "특별공급-기타 세대수 / ETC_HSHLDCO")
    private Integer etcHshldco;

    @Schema(description = "특별공급-이전기관 세대수 / TRANSR_INSTT_ENFSN_HSHLDCO")
    private Integer transrInsttEnfsnHshldco;

    @Schema(description = "특별공급-청년 세대수 / YGMN_HSHLDCO")
    private Integer ygmnHshldco;

    @Schema(description = "특별공급-신생아 세대수 / NWBB_HSHLDCO")
    private Integer nwbbHshldco;

    @Schema(description = "공급금액(분양최고금액) (단위:만원) / LTTOT_TOP_AMOUNT")
    private Integer lttotTopAmount;
}
