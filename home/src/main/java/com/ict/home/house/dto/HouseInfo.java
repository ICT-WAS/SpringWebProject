package com.ict.home.house.dto;

import com.ict.home.house.utility.PostalCodeFind;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.ToString;

import java.time.LocalDate;

@ToString
public class HouseInfo {

    @Schema(description = "House 고유 pk")
    private Long houseId;

    @Schema(description = "주택관리번호 / HOUSE_MANAGE_NO")
    private Long houseManageNo;

    @Schema(description = "주택명 / HOUSE_NM")
    private String houseNm;

    @Schema(description = "공급위치 우편번호 / HSSPLY_ZIP")
    private String hssplyZip;

    @Schema(description = "주택구분코드 (01: APT , 04: 무순위/잔여세대) / HOUSE_SECD")
    private String houseSecd;

    @Schema(description = "종류 일반 / 무순위")
    private String type;

    @Schema(description = "지역1")
    private String region1;

    @Schema(description = "지역2")
    private String region2;

    @Schema(description = "모집공고일 / RCRIT_PBLANC_DE")
    private LocalDate rcritPblancDe;

    @Schema(description = "공급규모 / TOT_SUPLY_HSHLDCO")
    private Integer totSuplyHsldco;

    public HouseInfo(Long houseId, Long houseManageNo, String houseNm, String hssplyZip, String houseSecd, LocalDate rcritPblancDe, Integer totSuplyHsldco) {
        this.houseId = houseId;
        this.houseManageNo = houseManageNo;
        this.houseNm = houseNm;
        this.hssplyZip = hssplyZip;
        this.houseSecd = houseSecd;
        this.rcritPblancDe = rcritPblancDe;
        this.totSuplyHsldco = totSuplyHsldco;
        this.type = houseSecd.equals("01") ? "일반" : "무순위";
        PostalCodeFind postalCodeFind = new PostalCodeFind();
        this.region1 = postalCodeFind.getRegion1(hssplyZip);
        this.region2 = postalCodeFind.getRegion2(hssplyZip);
    }

    public HouseInfo() {
    }

    public void setHssplyZip(String hssplyZip) {
        this.hssplyZip = hssplyZip;
        PostalCodeFind postalCodeFind = new PostalCodeFind();
        region1 = postalCodeFind.getRegion1(hssplyZip);
        region2 = postalCodeFind.getRegion2(hssplyZip);
    }

    public void setHouseSecd(String houseSecd) {
        this.houseSecd = houseSecd;
        type = houseSecd.equals("01") ? "일반" : "무순위";
    }

    public Long getHouseId() {
        return houseId;
    }

    public void setHouseId(Long houseId) {
        this.houseId = houseId;
    }

    public Long getHouseManageNo() {
        return houseManageNo;
    }

    public void setHouseManageNo(Long houseManageNo) {
        this.houseManageNo = houseManageNo;
    }

    public String getHouseNm() {
        return houseNm;
    }

    public void setHouseNm(String houseNm) {
        this.houseNm = houseNm;
    }

    public String getHssplyZip() {
        return hssplyZip;
    }

    public String getHouseSecd() {
        return houseSecd;
    }

    public String getType() {
        return type;
    }


    public String getRegion1() {
        return region1;
    }

    public String getRegion2() {
        return region2;
    }

    public LocalDate getRcritPblancDe() {
        return rcritPblancDe;
    }

    public void setRcritPblancDe(LocalDate rcritPblancDe) {
        this.rcritPblancDe = rcritPblancDe;
    }

    public Integer getTotSuplyHsldco() {
        return totSuplyHsldco;
    }

    public void setTotSuplyHsldco(Integer totSuplyHsldco) {
        this.totSuplyHsldco = totSuplyHsldco;
    }
}
