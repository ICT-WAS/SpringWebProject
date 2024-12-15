package com.ict.home.user.repository;

import com.ict.home.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select count(u) from User u where u.email = :email")
    Integer findByEmailCount(@Param("email") String email);

    boolean existsById(Long id);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    //이메일로 유저 정보 찾기 - UserUtilService.findByEmailWithValidation() 이용하여 옵셔널 처리
    Optional<User> findByEmail(String email);  //JPA
    Optional<User> findById(Long id);
    Optional<User> findByPhoneNumber(String phoneNumber);


}
