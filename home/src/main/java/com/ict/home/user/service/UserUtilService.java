package com.ict.home.user.service;

import com.ict.home.exception.BaseException;
import com.ict.home.user.User;
import com.ict.home.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.ict.home.exception.BaseResponseStatus.*;

/**
 * Optional 항목 예외 처리 util
 */
@Service
@RequiredArgsConstructor
public class UserUtilService {
    private final UserRepository userRepository;

    public User findByEmailWithValidation(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new BaseException(POST_USERS_NONE_EXISTS_EMAIL));
    }

    public User findByIdWithValidation(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new BaseException(POST_USERS_NONE_EXISTS_ID));
    }

    public User findByPhoneNumberValidation(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new BaseException(USERS_NONE_EXISTS_PHONE));
    }

    public User findByUserIdValidation(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new BaseException(USERS_EMPTY_USER_ID));
    }

    public Boolean existsByIdValidation(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BaseException(POST_USERS_NONE_EXISTS_ID);
        }
        return userRepository.existsById(userId);
    }
}
