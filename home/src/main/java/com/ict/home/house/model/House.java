package com.ict.home.house.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@ToString
@Schema(title = "주택청약 공고")
public class House {

    @Schema(description = "고유 pk")
    private Long houseId;

    @Schema(description = "주택관리번호 / HOUSE_MANAGE_NO")
    private Long houseManageNo;

    @Schema(description = "공고번호 / PBLANC_NO")
    private Long pblancNo;

    @Schema(description = "주택명 / HOUSE_NM")
    private String houseNm;

    @Schema(description = "주택구분코드 / HOUSE_SECD")
    private String houseSecd; // 01 : APT , 04 : 무순위/잔여세대

    @Schema(description = "주택구분코드명 / HOUSE_SECD_NM")
    private String houseSecdNm; // APT무순위/잔여세대

    @Schema(description = "공급위치 우편번호 / HSSPLY_ZIP")
    private String hssplyZip;

    @Schema(description = "공급위치 / HSSPLY_ADRES")
    private String hssplyAdres;

    @Schema(description = "공급규모 / TOT_SUPLY_HSHLDCO")
    private Integer totSuplyHsldco;

    @Schema(description = "모집공고일 / RCRIT_PBLANC_DE")
    private LocalDate rcritPblancDe;

    @Schema(description = "당첨자발표일 / PRZWNER_PRESNATN_DE")
    private LocalDate przwnerPresnatnDe;

    @Schema(description = "계약시작일 / CNTRCT_CNCLS_BGNDE")
    private LocalDate cntrctCnclsBgnde;

    @Schema(description = "계약종료일 / CNTRCT_CNCLS_ENDDE")
    private LocalDate cntrctCnclsEndde;

    @Schema(description = "계약종료일 / HMPG_ADRES")
    private String hmpgAdres;

    @Schema(description = "사업주체명(시행사) / BSNS_MBY_NM")
    private String bsnsMbyNm;

    @Schema(description = "문의처 / MDHS_TELNO")
    private String mdhsTelno;

    @Schema(description = "입주예정월 / MVN_PREARNGE_YM")
    private String mvnPrearngeYm;

    @Schema(description = "분양정보/모집공고 URL / PBLANC_URL")
    private String pblancUrl;

}
