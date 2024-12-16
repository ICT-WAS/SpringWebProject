package com.ict.home.community.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentUpdateRequest {

    @Schema(description = "댓글의 본문 내용", example = "내용을 입력하세요")
    private String comments;

    @Schema(description = "게시글의 고유 ID", example = "1")
    private Long postId;

    @Schema(description = "댓글 작성자의 고유 ID", example = "1")
    private Long userId;
}
