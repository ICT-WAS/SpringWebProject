package com.ict.home.house.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name = "detail")
@Getter
@ToString
@Schema(title = "주택청약 공고 상세정보")
public class Detail {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @Schema(description = "주택청약 공고 고유 pk")
    @ManyToOne
    @JoinColumn(name = "house_id", referencedColumnName = "house_id", insertable = false, updatable = false)
    private House house;

    @Schema(description = "모델번호")
    @Column(name = "MODEL_NO")
    private Integer modelNo;

    @Schema(description = "주택형")
    @Column(name = "HOUSE_TY")
    private String houseTy;

    @Schema(description = "공급면적")
    @Column(name = "SUPLY_AR")
    private BigDecimal suplyAr;

    @Schema(description = "일반공급세대수")
    @Column(name = "SUPLY_HSHLDCO")
    private Integer suplyHshldco;

    @Schema(description = "특별공급세대수")
    @Column(name = "SPSPLY_HSHLDCO")
    private Integer spsplyHshldco;

    @Schema(description = "특별공급-다자녀가구 세대수")
    @Column(name = "MNYCH_HSHLDCO")
    private Integer mnychHshldco;

    @Schema(description = "특별공급-신혼부부 세대수")
    @Column(name = "NWWDS_HSHLDCO")
    private Integer nwwdsHshldco;

    @Schema(description = "특별공급-생애최초 세대수")
    @Column(name = "LFE_FRST_HSHLDCO")
    private Integer lfeFrstHshldco;

    @Schema(description = "특별공급-노부모부양 세대수")
    @Column(name = "OLD_PARNTS_SUPORT_HSHLDCO")
    private Integer oldParntsSuportHshldco;

    @Schema(description = "특별공급-기관추천 세대수")
    @Column(name = "INSTT_RECOMEND_HSHLDCO")
    private Integer insttRecomendHshldco;

    @Schema(description = "특별공급-기타 세대수")
    @Column(name = "ETC_HSHLDCO")
    private Integer etcHshldco;

    @Schema(description = "특별공급-이전기관 세대수")
    @Column(name = "TRANSR_INSTT_ENFSN_HSHLDCO")
    private Integer transrInsttEnfsnHshldco;

    @Schema(description = "특별공급-청년 세대수")
    @Column(name = "YGMN_HSHLDCO")
    private Integer ygmnHshldco;

    @Schema(description = "특별공급-신생아 세대수")
    @Column(name = "NWBB_HSHLDCO")
    private Integer nwbbHshldco;

    @Schema(description = "공급금액(분양최고금액) (단위:만원)")
    @Column(name = "LTTOT_TOP_AMOUNT")
    private Integer lttotTopAmount;
}
