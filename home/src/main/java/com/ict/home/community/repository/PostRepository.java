package com.ict.home.community.repository;

import com.ict.home.community.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByTitleContainingOrSubjectContaining(String titleKeyword, String subjectKeyword);
}
