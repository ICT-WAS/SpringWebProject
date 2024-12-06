package com.ict.home.house.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@ToString
@Schema(title = "APT 공급정보")
public class Detail01 {

    @Schema(description = "고유 pk")
    private Long detail01Id;

    @Schema(description = "주택청약 공고 고유 pk")
    private Long houseId;

    @Schema(description = "주택상세구분코드 / HOUSE_DTL_SECD")
    private Integer houseDtlSecd; // (01: 민영, 03: 국민)

    @Schema(description = "주택상세구분코드명 / HOUSE_DTL_SECD_NM")
    private String houseDtlSecdNm; // 민영, 국민

    @Schema(description = "분양구분코드 / RENT_SECD")
    private Integer rentSecd; // (0: 분양주택, 1: 분양전환 가능임대)

    @Schema(description = "분양구분코드명 / RENT_SECD_NM")
    private String rentSecdNm; // '분양주택' '분양전환 가능임대'

    @Schema(description = "공급지역코드 / SUBSCRPT_AREA_CODE")
    private String subscrptAreaCode; // https://miro.com/app/board/uXjVLQRFe_4=/ 여기서 찾기

    @Schema(description = "공급지역명 / SUBSCRPT_AREA_CODE_NM")
    private String subscrptAreaCodeNm;

    @Schema(description = "청약접수시작일 / RCEPT_BGNDE")
    private LocalDate rceptBgnde;

    @Schema(description = "청약접수종료일 / RCEPT_ENDDE")
    private LocalDate rceptEndde;

    @Schema(description = "특별공급 접수시작일 / SPSPLY_RCEPT_BGNDE")
    private LocalDate spsplyRceptBgnde;

    @Schema(description = "특별공급 접수종료일 / SPSPLY_RCEPT_ENDDE")
    private LocalDate spsplyRceptEndde;

    @Schema(description = "1순위 해당지역 접수시작일 / GNRL_RNK1_CRSPAREA_RCPTDE")
    private LocalDate gnrlRnk1CrspareaRcptde;

    @Schema(description = "1순위 해당지역 접수종료일 / GNRL_RNK1_CRSPAREA_ENDDE")
    private LocalDate gnrlRnk1CrspareaEndde;

    @Schema(description = "1순위 경기지역 접수시작일 / GNRL_RNK1_ETC_GG_RCPTDE")
    private LocalDate gnrlRnk1EtcGgRcptde;

    @Schema(description = "1순위 경기지역 접수종료일 / GNRL_RNK1_ETC_GG_ENDDE")
    private LocalDate gnrlRnk1EtcGgEndde;

    @Schema(description = "1순위 기타지역 접수시작일 / GNRL_RNK1_ETC_AREA_RCPTDE")
    private LocalDate gnrlRnk1EtcAreaRcptde;

    @Schema(description = "1순위 기타지역 접수종료일 / GNRL_RNK1_ETC_AREA_ENDDE")
    private LocalDate gnrlRnk1EtcAreaEndde;

    @Schema(description = "2순위 해당지역 접수종료일 / GNRL_RNK2_CRSPAREA_RCPTDE")
    private LocalDate gnrlRnk2CrspareaRcptde;

    @Schema(description = "2순위 해당지역 접수종료일 / GNRL_RNK2_CRSPAREA_ENDDE")
    private LocalDate gnrlRnk2CrspareaEndde;

    @Schema(description = "2순위 경기지역 접수종료일 / GNRL_RNK2_ETC_GG_RCPTDE")
    private LocalDate gnrlRnk2EtcGgRcptde;

    @Schema(description = "2순위 경기지역 접수종료일 / GNRL_RNK2_ETC_GG_ENDDE")
    private LocalDate gnrlRnk2EtcGgEndde;

    @Schema(description = "2순위 기타지역 접수종료일 / GNRL_RNK2_ETC_AREA_RCPTDE")
    private LocalDate gnrlRnk2EtcAreaRcptde;

    @Schema(description = "2순위 기타지역 접수종료일 / GNRL_RNK2_ETC_AREA_ENDDE")
    private LocalDate gnrlRnk2EtcAreaEndde;

    @Schema(description = "건설업체명(시공사) / CNSTRCT_ENTRPS_NM")
    private String cnstrctEntrpsNm;

    @Schema(description = "투기과열지구 / SPECLT_RDN_EARTH_AT")
    private char specltRdnEarthAt; // Y or N

    @Schema(description = "조정대상지역 / MDAT_TRGET_AREA_SECD")
    private char mdatTrgetAreaSecd; // Y or N

    @Schema(description = "분양가상한제 / PARCPRC_ULS_AT")
    private char parcprcUlsAt; // Y or N

    @Schema(description = "정비사업 / IMPRMN_BSNS_AT")
    private char imprnmBsnsAt; // Y or N

    @Schema(description = "공공주택지구 / PUBLIC_HOUSE_EARTH_AT")
    private char publicHouseEarthAt; // Y or N

    @Schema(description = "대규모 택지개발지구 / LRSCL_BLDLND_AT")
    private char lrsclBldlndAt; // Y or N

    @Schema(description = "수도권 내 민영 공공주택지구 / NPLN_PRVOPR_PUBLIC_HOUSE_AT")
    private char nplnPrvoprPublicHouseAt; // Y or N

    @Schema(description = "공공주택 특별법 적용 여부 / PUBLIC_HOUSE_SPCLW_APPLC_AT")
    private char publicHouseSpclwApplcAt; // Y or N
}