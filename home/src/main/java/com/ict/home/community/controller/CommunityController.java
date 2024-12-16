package com.ict.home.community.controller;

import com.ict.home.community.dto.CommentDto;
import com.ict.home.community.dto.CommentUpdateRequest;
import com.ict.home.community.dto.PostUpdateRequest;
import com.ict.home.community.dto.PostingDto;
import com.ict.home.community.model.Comment;
import com.ict.home.community.model.Post;
import com.ict.home.community.service.CommunityService;
import com.ict.home.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService cs;

    @GetMapping("")
    @Operation(summary = "게시글 목록", description = "게시글을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게시글 조회 성공",
                    content = @Content(schema = @Schema(implementation = Post.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> getPostList(
            @RequestParam(name = "keyword", required = false) String keyword,  // 검색어 파라미터
            @RequestParam(name = "page", defaultValue = "1") int page,  // 페이지 번호 (기본값 1)
            @RequestParam(name = "size", defaultValue = "10") int size  // 페이지 크기 (기본값 10)
    ) {
        List<Post> postList = cs.getPostList();

        // 키워드 검색이 있을 경우 필터링
        List<Post> filteredPosts = postList;

        if (keyword != null && !keyword.trim().isEmpty()) {
            filteredPosts = postList.stream()
                    .filter(post -> post.getTitle().contains(keyword) || post.getSubject().contains(keyword))
                    .collect(Collectors.toList());
        }

        if (filteredPosts.isEmpty() || filteredPosts == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("totalCount", 0);
            response.put("content", new ArrayList<>());
            return ResponseEntity.ok(response);
        }

        filteredPosts = filteredPosts.stream()
                .sorted((post1, post2) -> post2.getCreatedAt().compareTo(post1.getCreatedAt())) // 내림차순 정렬
                .collect(Collectors.toList());

        // 페이지네이션 처리
        int totalCount = filteredPosts.size();
        int start = (page - 1) * size;
        int end = Math.min(start + size, totalCount);

        if (start >= totalCount) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("페이지 번호가 범위를 벗어났습니다.");
        }

        List<Post> paginatedPosts = filteredPosts.subList(start, end);

        // 응답 반환
        Map<String, Object> response = new HashMap<>();
        response.put("content", paginatedPosts);  // 현재 페이지에 해당하는 게시글 목록
        response.put("totalCount", totalCount);  // 총 게시글 수
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    @Operation(summary = "게시글 등록", description = "새로운 게시글을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게시글 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리소스를 찾을 수 없음")
    })
    public ResponseEntity<?> addPost(@RequestBody PostingDto postingDto) {
        Long userId = postingDto.getUserId();
        String title = postingDto.getTitle();
        String subject = postingDto.getSubject();
        subject = subject.replaceAll("\n", "<br>");

        Long postId = cs.create(userId, title, subject);

        Map<String, Long> response = new HashMap<>();
        response.put("postId", postId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "게시글 조회", description = "주어진 ID에 해당하는 게시글을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게시글 조회 성공",
                    content = @Content(schema = @Schema(implementation = Post.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 게시글 ID"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> getPostById(
            @Parameter(name = "postId", description = "조회할 게시글의 고유 ID") @PathVariable Long postId) {
        Optional<Post> postDetail = cs.getPostDetail(postId);

        Post post = postDetail.orElse(null);

        if (post == null) {
            return ResponseEntity.status(400).body("Post not found");
        }

        return ResponseEntity.ok(post);
    }

    @PatchMapping("/{postId}")
    @Operation(summary = "게시글 수정", description = "주어진 ID에 해당하는 게시글을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게시글을 수정했습니다."),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없습니다."),
            @ApiResponse(responseCode = "400", description = "잘못된 요청입니다.")
    })
    public ResponseEntity<?> updatePostById(
            @Parameter(name = "postId", description = "조회할 게시글의 고유 ID") @PathVariable Long postId,
            @RequestBody PostUpdateRequest postUpdateRequest) {

        String title = postUpdateRequest.getTitle();
        String subject = postUpdateRequest.getSubject();
        subject = subject.replaceAll("\n", "<br>");

        return cs.updatePost(postId, title, subject);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "게시글 삭제", description = "주어진 ID에 해당하는 게시글을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "삭제되었습니다.")
    })
    public ResponseEntity<?> deletePostById(
            @Parameter(name = "postId", description = "삭제할 게시글의 고유 ID") @PathVariable Long postId){
        boolean isDeleted = cs.deletePost(postId);

        if (isDeleted) {
            return ResponseEntity.ok().build();  // 삭제 성공, HTTP 200
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다."); // 삭제 실패, HTTP 404
        }
    }

    @GetMapping("/{postId}/comments")
    @Operation(summary = "게시글의 댓글 조회", description = "주어진 ID에 해당하는 게시글의 댓글을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글을 조회하였습니다.")
    })
    public ResponseEntity<?> getCommentByPostId(
            @Parameter(name = "postId", description = "조회할 게시글의 고유 ID") @PathVariable Long postId){

        List<Comment> commentsByPostId = cs.getCommentsByPostId(postId);
        return ResponseEntity.ok(commentsByPostId);
    }

    @PostMapping("/{postId}/comments")
    @Operation(summary = "댓글 등록", description = "주어진 ID에 해당하는 게시글에 댓글을 작성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글을 작성하였습니다.")
    })
    public ResponseEntity<?> addCommentToPost(
            @Parameter(name = "postId", description = "댓글을 작성할 게시글의 고유 ID") @PathVariable Long postId,
            @RequestBody CommentDto commentDto){

        String comments = commentDto.getComments();
        Long parentCommentId = commentDto.getParentCommentId();
        Integer depth = commentDto.getDepth();
        Long userId = commentDto.getUserId();

        Comment comment = cs.createComment(postId, comments, depth, parentCommentId, userId);

        return ResponseEntity.ok(comment);
    }

    @PatchMapping("/{commentId}/comment")
    @Operation(summary = "댓글 수정", description = "주어진 ID에 해당하는 댓글을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글을 수정했습니다.")
    })
    public ResponseEntity<?> updateCommentById(
            @Parameter(name = "commentId", description = "수정할 댓글의 고유 ID") @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest commentUpdateRequest){

        String comments = commentUpdateRequest.getComments();

        return cs.updateComment(commentId, comments);
    }

    @DeleteMapping("/{commentId}/comment")
    @Operation(summary = "댓글 삭제", description = "주어진 ID에 해당하는 댓글을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글을 삭제했습니다."),
            @ApiResponse(responseCode = "404", description = "댓글을 찾을 수 없습니다.")
    })
    public ResponseEntity<?> deleteCommentById(
            @Parameter(name = "commentId", description = "삭제할 댓글의 고유 ID") @PathVariable Long commentId) {

        boolean isDeleted = cs.deleteComment(commentId);

        if (isDeleted) {
            return ResponseEntity.ok().build();  // 삭제 성공, HTTP 200
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("댓글을 찾을 수 없습니다."); // 삭제 실패, HTTP 404
        }
    }
}
