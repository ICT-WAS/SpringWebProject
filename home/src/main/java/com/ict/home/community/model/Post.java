package com.ict.home.community.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Schema(title = "게시글")
public class Post {

    @Schema(description = "게시글 고유 pk")
    private Long postId;

    @Schema(description = "게시글 제목")
    private String title;

    @Schema(description = "게시글 내용")
    private String subject;

    public Post(Long postId, String title, String subject) {
        this.postId = postId;
        this.title = title;
        this.subject = subject;
    }

    public Post() {
    }
}
