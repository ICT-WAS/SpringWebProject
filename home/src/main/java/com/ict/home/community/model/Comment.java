package com.ict.home.community.model;

import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@Setter
@ToString
@Schema(title = "댓글")
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Schema(description = "고유 pk")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @NotNull
    @Schema(description = "회원 고유 pk")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @NotNull
    @Schema(description = "게시글 고유 pk")
    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "post_id", nullable = false, foreignKey = @ForeignKey(name = "FK_COMMENT_POST"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Post post;

    @NotNull
    @Schema(description = "깊이 (1: 댓글, 2: 대댓글)")
    @Column(name = "depth", nullable = false)
    private Integer depth;

    @Schema(description = "대댓글 시 댓글 고유 pk")
    @ManyToOne
    @JoinColumn(name = "parent_comment_id", referencedColumnName = "comment_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Comment parentComment;

    @NotNull
    @Schema(description = "내용")
    @Column(name = "comments", nullable = false, columnDefinition = "TEXT")
    private String comments;

    @NotNull
    @Schema(description = "작성시각")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Schema(description = "수정시각")
    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;

}
