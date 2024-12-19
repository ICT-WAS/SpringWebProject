package com.ict.home.community.service;

import com.ict.home.community.model.Comment;
import com.ict.home.community.model.Post;
import com.ict.home.community.repository.CommentRepository;
import com.ict.home.community.repository.PostRepository;
import com.ict.home.notification.enumeration.NotificationType;
import com.ict.home.notification.model.Notification;
import com.ict.home.notification.repository.NotificationRepository;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    @PersistenceContext
    private final EntityManager em;

    private final PostRepository pr;

    private final CommentRepository cr;

    private final UserRepository ur;

    private final NotificationRepository nr;

    @Override
    public Long create(Long userId, String title, String subject) {
        User user = ur.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setTitle(title);
        post.setSubject(subject);
        Post savedPost = pr.save(post);

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
        Post post = pr.findById(postId).get();

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setComments(comments);
        comment.setDepth(depth);

        // 댓글 작성 시 알림
        if (!Objects.equals(post.getUser().getId(), id)) {
            // 게시글 작성자와 댓글 작성자가 같지 않을 때 게시글 작성자에게 댓글 알림 보내기
            Notification notification = new Notification();
            notification.setCreatedAt(LocalDateTime.now());
            notification.setPost(post);
            notification.setUser(post.getUser());
            notification.setType(NotificationType.ABOUT_POST);
            String message = "내 \"" + post.getTitle() + "\" 게시글에 \'" + user.getUsername() + "\' 님이 댓글을 남겼습니다.";
            notification.setMessage(message);

            nr.save(notification);
        }



        if (depth == 2) {
            Comment parentComment = cr.findById(parentCommentId).get();
            comment.setParentComment(parentComment);

            // 답글 작성 시 알림
            List<Comment> byParentComment = cr.findByParentComment(parentComment);

            List<Long> sendNotificationList = new ArrayList<>();

            for (Comment reply : byParentComment) {
                // 답글 작성 시, 동일 댓글 다른 작성자들에게 알림 보내기
                if (Objects.equals(post.getUser().getId(), reply.getUser().getId())) {
                    continue;
                }
                if(!Objects.equals(reply.getUser().getId(), id) && !sendNotificationList.contains(reply.getUser().getId())) {
                    Notification notification = new Notification();
                    notification.setType(NotificationType.ABOUT_COMMENT);
                    notification.setPost(post);
                    notification.setUser(reply.getUser());
                    notification.setCreatedAt(LocalDateTime.now());
                    String message = "\"" + post.getTitle() + "\" 게시글의 쓴 댓글에 \'" + user.getUsername() + "\' 님이 답글을 남겼습니다.";
                    notification.setMessage(message);
                    sendNotificationList.add(reply.getUser().getId());

                    nr.save(notification);
                }
            }

            if (!Objects.equals(post.getUser().getId(), parentComment.getUser().getId())) {
                // 답글 작성시 본 댓글 작성자에게 알림 보내기
                if (!Objects.equals(parentComment.getUser().getId(), id) && !sendNotificationList.contains(parentComment.getUser().getId())) {
                    Notification notification = new Notification();
                    notification.setType(NotificationType.ABOUT_COMMENT);
                    notification.setPost(post);
                    notification.setUser(parentComment.getUser());
                    notification.setCreatedAt(LocalDateTime.now());
                    String message = "\"" + post.getTitle() + "\" 게시글의 쓴 댓글에 \'" + user.getUsername() + "\' 님이 답글을 남겼습니다.";
                    notification.setMessage(message);

                    nr.save(notification);
                }
            }


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

    @Override
    public List<Comment> getCommentList() {

        return cr.findAll();
    }
}
