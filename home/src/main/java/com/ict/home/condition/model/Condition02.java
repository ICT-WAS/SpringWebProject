package com.ict.home.condition.model;

import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.type.YesNoConverter;

@Entity
@Table(name = "condition02")
@Getter
@Setter
@ToString
@Schema(title = "조건02")
@AllArgsConstructor
@NoArgsConstructor
public class Condition02 {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition02_id")
    private Long condition02Id;

    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User user;

    @NotNull
    @Schema(description = "본인 또는 배우자의 증, 조부모 동거여부 (Y or N)")
    @Column(name = "grandparents", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean grandparents;

    @NotNull
    @Schema(description = "본인 또는 배우자의 부모님 동거여부(Y or N)")
    @Column(name = "parents", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean parents;

    @NotNull
    @Schema(description = "자녀(태아 포함)와 동거 여부(Y or N)")
    @Column(name = "children", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean children;

    @NotNull
    @Schema(description = "부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀와 동거 여부(Y or N)")
    @Column(name = "grandchildren", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean grandchildren;

    @NotNull
    @Schema(description = "배우자와 동거 여부(Y or N)")
    @Column(name = "spouse", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean spouse;

    @NotNull
    @Schema(description = "사위 또는 며느리와 동거 여부(Y or N)")
    @Column(name = "in_laws", nullable = false)
    @Convert(converter = YesNoConverter.class)
    private Boolean inLaws;

}
