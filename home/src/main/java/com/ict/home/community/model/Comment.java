package com.ict.home.community.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Schema(title = "댓글")
public class Comment {

    @Schema(description = "고유 pk")
    private Long commentId;

    @Schema(description = "작성자 고유 pk")
    private Long memberId;

    @Schema(description = "게시글 고유 pk")
    private Long postId;

    @Schema(description = "깊이 (1: 댓글, 2: 대댓글")
    private Integer depth;

    @Schema(description = "대댓글 시 댓글 고유 pk")
    private Long commentId2;

    @Schema(description = "내용")
    private String comment;

    @Schema(description = "작성시각")
    private LocalDateTime createdAt;

    @Schema(description = "수정시각")
    private LocalDateTime updatedAt;

}
