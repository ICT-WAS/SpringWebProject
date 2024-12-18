package com.ict.home.interest.model;

import com.ict.home.house.model.House;
import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.YesNoConverter;

@Entity
@Table(name = "interest")
@Getter
@Setter
@ToString
@Schema(title = "관심 공고")
@AllArgsConstructor
@NoArgsConstructor
public class Interest {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interest_id")
    private Long interestId;

    @NotNull
    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @NotNull
    @Schema(description = "주택청약 공고 고유 pk")
    @ManyToOne
    @JoinColumn(name = "house_id", referencedColumnName = "house_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private House house;

}
