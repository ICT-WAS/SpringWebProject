package com.ict.home.condition.model;

import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.YesNoConverter;

import java.time.LocalDate;

@Entity
@Table(name = "family")
@Getter
@Setter
@ToString
@Schema(title = "세대구성원")
@AllArgsConstructor
@NoArgsConstructor
public class Family {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "family_id")
    private Long familyId;

    @NotNull
    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @NotNull
    @Schema(description = "관계")
    @Column(name = "relationship", nullable = false)
    private Integer relationship; // https://miro.com/app/board/uXjVLQRFe_4=/ 찾기 '가족관계'

    @NotNull
    @Schema(description = "동거여부 (0: 동거x, 1: 동거o, 2: 배우자와 동거o)")
    @Column(name = "living_together", nullable = false)
    private Integer livingTogether;

    @Schema(description = "동거기간 (1: 1년 미만, 2: 1년 이상 3년 미만, 3: 3년 이상)")
    @Column(name = "living_together_date", nullable = true)
    private Integer livingTogetherDate;

    @Schema(description = "생년월일")
    @Column(name = "birthday", nullable = true)
    private LocalDate birthday;

    @Schema(description = "혼인여부 (Y: 혼인x, N: 혼인o)")
    @Column(name = "is_married", nullable = true)
    @Convert(converter = YesNoConverter.class)
    private Boolean isMarried;

    @NotNull
    @Schema(description = "주택/분양권 소유 수")
    @Column(name = "house_count", nullable = false)
    private Integer houseCount = 0;

    @Schema(description = "주택 처분 날짜")
    @Column(name = "house_sold_date", nullable = true)
    private LocalDate houseSoldDate;
}
