package com.ict.home.community.service;

import com.ict.home.community.model.Comment;
import com.ict.home.community.model.Post;
import com.ict.home.community.repository.CommentRepository;
import com.ict.home.community.repository.PostRepository;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    @PersistenceContext
    private final EntityManager em;

    private final PostRepository pr;

    private final CommentRepository cr;

    private final UserRepository ur;

    @Override
    public Long create(Long userId, String title, String subject) {
        System.out.println("userId = " + userId);
        System.out.println("title = " + title);
        System.out.println("subject = " + subject);
        User user = ur.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));


        Post post = new Post();
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setTitle(title);
        post.setSubject(subject);
        Post savedPost = pr.save(post);
        System.out.println("savedPost = " + savedPost);
        System.out.println("savedPost = " + savedPost.getPostId());

        return savedPost.getPostId();
    }

    @Override
    public List<Post> getPostList() {

        return pr.findAll();
    }

    @Override
    public Optional<Post> getPostDetail(Long postId) {
        return pr.findById(postId);
    }

    @Override
    public List<Comment> getCommentsByPostId(Long postId) {
        return cr.findByPostPostId(postId);
    }

    @Override
    public Comment createComment(Long postId, String comments, Integer depth, Long parentCommentId, Long id) {
        User user = ur.findById(id).get();
        System.out.println("user = " + user.toString());
        Post post = pr.findById(postId).get();

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setComments(comments);
        comment.setDepth(depth);

        if (depth == 2) {
            Comment parentComment = cr.findById(parentCommentId).get();
            comment.setParentComment(parentComment);
        } else {
            comment.setParentComment(null);
        }

        comment.setCreatedAt(LocalDateTime.now());

        return cr.save(comment);
    }

    @Override
    public boolean deleteComment(Long commentId) {
        Optional<Comment> commentOptional = cr.findById(commentId);

        if (commentOptional.isPresent()) {
            cr.deleteById(commentId); // 댓글이 존재하면 삭제
            return true;
        } else {
            return false;  // 댓글이 존재하지 않으면 삭제하지 않음
        }
    }

    @Override
    public boolean deletePost(Long postId) {
        Optional<Post> postOptional = pr.findById(postId);

        if (postOptional.isPresent()) {
            pr.deleteById(postId);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public ResponseEntity<?> updatePost(Long postId, String title, String subject) {
        // 게시글이 존재하는지 확인
        Optional<Post> existingPost = pr.findById(postId);
        if (!existingPost.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }

        Post post = existingPost.get();

        // 요청 본문에서 수정할 제목과 내용을 받아와서 게시글에 반영
        if (title != null) {
            post.setTitle(title);
        }
        if (subject != null) {
            post.setSubject(subject);
        }

        post.setUpdatedAt(LocalDateTime.now());

        // 수정된 게시글을 저장
        Post saved = pr.save(post);

        if (saved.getTitle().equals(title) && saved.getSubject().equals(subject)) {
            return ResponseEntity.status(HttpStatus.OK).body(postId);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 수정에 실패하였습니다.");
        }
    }

    @Override
    public ResponseEntity<?> updateComment(Long commentId, String comments) {
        Optional<Comment> existingComment = cr.findById(commentId);

        if (!existingComment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("댓글을 찾을 수 없습니다.");
        }

        Comment comment = existingComment.get();
        comment.setUpdatedAt(LocalDateTime.now());
        if (comments != null) {
            comment.setComments(comments);
        }

        Comment saved = cr.save(comment);

        if (saved.getComments().equals(comments)) {
            return ResponseEntity.ok().body("댓글이 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 수정에 실패하였습니다.");
        }
    }
}
