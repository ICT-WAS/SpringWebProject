package com.ict.home.notification.model;

import com.ict.home.community.model.Post;
import com.ict.home.condition.enumeration.AccountType;
import com.ict.home.house.model.House;
import com.ict.home.notification.enumeration.NotificationType;
import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.YesNoConverter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@ToString
@Schema(title = "알림")
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @NotNull
    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @NotNull
    @Schema(description = "알람 종류")
    @Column(name = "type", nullable = true)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @NotNull
    @Schema(description = "메시지")
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @NotNull
    @Schema(description = "확인 여부")
    @Column(name = "is_checked", nullable = false, columnDefinition = "CHAR(1) DEFAULT 'N'")
    @Convert(converter = YesNoConverter.class)
    private Boolean isChecked = Boolean.FALSE;

    @NotNull
    @Schema(description = "알림일시")
    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Schema(description = "주택청약 공고 고유 pk")
    @OneToOne
    @JoinColumn(name = "house_id", referencedColumnName = "house_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private House house;

    @Schema(description = "게시글 고유 pk")
    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "post_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Post post;

}
