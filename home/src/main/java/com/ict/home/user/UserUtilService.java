package com.ict.home.user;

import com.ict.home.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.ict.home.exception.BaseResponseStatus.POST_USERS_NONE_EXISTS_EMAIL;

/**
 * Optional 항목 예외 처리 util
 */
@Service
@RequiredArgsConstructor
public class UserUtilService {
    private final UserRepository userRepository;

    public User findByEmailWithValidation(String email) {
        return userRepository.findByEmail(email).orElseThrow(()-> new BaseException(POST_USERS_NONE_EXISTS_EMAIL));
    }
}
