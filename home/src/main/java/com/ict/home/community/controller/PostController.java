package com.ict.home.community.controller;

import com.ict.home.community.model.Post;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/post")
public class PostController {

    @PostMapping("")
    @Operation(summary = "게시글 등록")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게시글 등록 성공", content = @Content(schema = @Schema(description = "~schema description test~", name = "~schema description test~", example = "~schema example test"))),
            @ApiResponse(responseCode = "400", description = "~ApiResponse responseCode400 description test~"),
            @ApiResponse(responseCode = "401", description = "~ApiResponse responseCode401 description test~"),
            @ApiResponse(responseCode = "404", description = "~ApiResponse responseCode404 description test~")
            })
    public Post posting(@Parameter(name = "memberId", description = "게시글 작성자의 pk") String memberId,
                        @Parameter(name = "title", description = "게시글 제목") String title,
                        @Parameter(name = "subject", description = "게시글 본문 내용") String subject){

        return new Post();
    }

    @GetMapping("/{postId}")
    @Operation(summary = "게시글 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "232513253200", description = "게시글 불러오기 성공"),
            @ApiResponse(responseCode = "200", description = "게시글 불러오기 성공", content = @Content(schema = @Schema(implementation = Post.class))),
            @ApiResponse(responseCode = "400", description = "postId가 존재하지 않습니다.")
    })
    public ResponseEntity<?> post(@Parameter(name = "postId", description = "게시글의 고유 pk") @PathVariable Long postId){
        //DB에서 가져와서 반환해주면 됩니다.
        if (postId <= 0) {
            return ResponseEntity.badRequest().body("Invalid ID supplied");
        }

        if (postId == 5){
            return ResponseEntity.status(404).body("Post not found");
        }

        Post post = new Post(postId, "이건 제목", "이건 내용");
        return ResponseEntity.ok(post);
    }
}
