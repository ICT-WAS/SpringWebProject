package com.ict.home.community.service;

import com.ict.home.community.model.Post;

import java.util.List;

public interface CommunityService {

    Long create(Long userId, String title, String subject);

    List<Post> getPostList();
}
