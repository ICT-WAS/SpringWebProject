package com.ict.home.community.model;

import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Getter
@Setter
@ToString
@Schema(title = "게시글")
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User user;

    @Schema(description = "카테고리")
    @Column(name = "category", nullable = true)
    private String category;

    @NotNull
    @Schema(description = "제목")
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Schema(description = "내용")
    @Column(name = "subject", nullable = false)
    private String subject;

    @NotNull
    @Schema(description = "작성시각")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Schema(description = "수정시각")
    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;
}
