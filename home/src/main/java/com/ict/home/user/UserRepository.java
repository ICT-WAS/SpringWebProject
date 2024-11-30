package com.ict.home.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select count(u) from User u where u.email = :email")
    Integer findByEmailCount(@Param("email") String email);

    Optional<User> findByEmail(String email);  //JPA
}
