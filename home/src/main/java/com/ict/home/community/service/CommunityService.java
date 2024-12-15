package com.ict.home.community.service;

import com.ict.home.community.model.Comment;
import com.ict.home.community.model.Post;
import org.springframework.http.ResponseEntity;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface CommunityService {

    Long create(Long userId, String title, String subject);

    List<Post> getPostList();

    Optional<Post> getPostDetail(Long postId);

    List<Comment> getCommentsByPostId(Long postId);

    Comment createComment(Long postId, String comments, Integer depth, Long parentCommentId, Long userId);

    boolean deleteComment(Long commentId);

    boolean deletePost(Long postId);

    ResponseEntity<?> updatePost(Long postId, String title, String subject);

    ResponseEntity<?> updateComment(Long commentId, String comments);
}
