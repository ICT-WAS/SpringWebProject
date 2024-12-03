package com.ict.home.login.jwt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    //유저 아이디 기준 토큰 삭제
    void deleteByUserId(Long userId);

    //유저 아이디 기준으로 토큰 검색
    Token findByUserId(Long userId);

    //유저 아이디 기준 토큰 유무 확인
    boolean existsByUserId(Long userId);
}
