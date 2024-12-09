package com.ict.home.house.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "detail04")
@Getter
@ToString
@Schema(title = "무순위 및 잔여세대 공급정보")
public class Detail04 {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail04_id")
    private Long detail04Id;

    @Schema(description = "주택청약 공고 고유 pk")
    @OneToOne
    @JoinColumn(name = "house_id", referencedColumnName = "house_id", insertable = false, updatable = false)
    private House house;

    @Schema(description = "청약접수시작일")
    @Column(name = "SUBSCRPT_RCEPT_BGNDE")
    private LocalDate subscrptRceptBgnde;

    @Schema(description = "청약접수종료일")
    @Column(name = "SUBSCRPT_RCEPT_ENDDE")
    private LocalDate subscrptRceptEndde;

    @Schema(description = "특별공급 접수시작일")
    @Column(name = "SPSPLY_RCEPT_BGNDE")
    private LocalDate spsplyRceptBgnde;

    @Schema(description = "특별공급 접수종료일")
    @Column(name = "SPSPLY_RCEPT_ENDDE")
    private LocalDate spsplyRceptEndde;

    @Schema(description = "일반공급접수 시작일")
    @Column(name = "GNRL_RCEPT_BGNDE")
    private LocalDate gnrlRceptBgnde;

    @Schema(description = "일반공급접수 종료일")
    @Column(name = "GNRL_RCEPT_ENDDE")
    private LocalDate gnrlRceptEndde;
}
