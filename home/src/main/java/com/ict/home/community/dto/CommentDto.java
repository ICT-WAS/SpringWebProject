package com.ict.home.community.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CommentDto {

    @Schema(description = "댓글 작성자의 고유 ID", example = "1")
    private Long userId;

    @Schema(description = "게시글의 고유 ID", example = "1")
    private Long postId;

    @Schema(description = "댓글의 본문 내용", example = "내용을 입력하세요")
    private String comments;

    @Schema(description = "1: 댓글, 2: 대댓글", example = "깊이")
    private Integer depth;

    @Schema(description = "대댓글 시 댓글 고유 Id", example = "1")
    private Long parentCommentId;
}
