package com.ict.home.community.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PostingDto {

    @Schema(description = "게시글 작성자의 고유 ID", example = "1")
    private Long userId;

    @Schema(description = "게시글 제목", example = "제목을 입력하세요")
    private String title;

    @Schema(description = "게시글 본문 내용", example = "내용을 입력하세요")
    private String subject;
}
