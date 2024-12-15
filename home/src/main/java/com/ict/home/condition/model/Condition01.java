package com.ict.home.condition.model;

import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.type.YesNoConverter;

import java.time.LocalDate;

@Entity
@Table(name = "condition01")
@Getter
@Setter
@ToString
@Schema(title = "조건01")
@AllArgsConstructor
@NoArgsConstructor
public class Condition01 {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition01_id")
    private Long condition01Id;

    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @NotNull
    @Schema(description = "신청자 생년월일")
    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @NotNull
    @Schema(description = "현재 거주지역 시/도")
    @Column(name = "si_do", nullable = false)
    private String siDo;

    @NotNull
    @Schema(description = "현재거주지역 군/구")
    @Column(name = "gun_gu", nullable = false)
    private String gunGu;

    @NotNull
    @Schema(description = "입주 일자")
    @Column(name = "transfer_date", nullable = false)
    private LocalDate transferDate;

    @Schema(description = "현재 지역 입주일")
    @Column(name = "region_move_in_date", nullable = true)
    private LocalDate regionMoveInDate;

    @Schema(description = "수도권 입주일")
    @Column(name = "metropolitan_area_date", nullable = true)
    private LocalDate metropolitanAreaDate;

    @NotNull
    @Schema(description = "세대주 여부(N: 세대원, Y: 세대주)")
    @Column(name = "is_householder", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean isHouseHolder;

    @NotNull
    @Schema(description = "결혼 여부(0: 미혼, 1: 기혼, 2: 예비신혼부부, 3: 한부모)")
    @Column(name = "married", nullable = false)
    private Integer married;

    @Schema(description = "혼인 신고일")
    @Column(name = "married_date", nullable = true)
    private LocalDate marriedDate;
}
