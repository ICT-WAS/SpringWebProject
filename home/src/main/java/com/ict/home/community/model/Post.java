package com.ict.home.community.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Schema(title = "게시글")
public class Post {

    @Schema(description = "고유 pk")
    private Long postId;

    @Schema(description = "작성자 고유 pk")
    private Long memberId;

    @Schema(description = "카테고리")
    private String category;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "내용")
    private String subject;

    @Schema(description = "작성시각")
    private LocalDateTime createdAt;

    @Schema(description = "수정시각")
    private LocalDateTime updatedAt;
}
