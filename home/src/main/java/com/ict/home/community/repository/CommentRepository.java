package com.ict.home.community.repository;

import com.ict.home.community.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostPostId(Long postId);

    // 특정 부모 댓글을 가진 모든 대댓글 조회
    List<Comment> findByParentComment(Comment parentComment);

}
