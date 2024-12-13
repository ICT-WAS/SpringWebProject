package com.ict.home.community.service;

import com.ict.home.community.model.Post;
import com.ict.home.community.repository.PostRepository;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService{

    @PersistenceContext
    private final EntityManager em;

    private final PostRepository pr;

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
}
