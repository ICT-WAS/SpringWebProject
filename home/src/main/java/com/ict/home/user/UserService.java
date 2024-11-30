package com.ict.home.user;

import com.ict.home.exception.BaseException;
import com.ict.home.login.jwt.Secret;
import com.ict.home.user.dto.PostUserReq;
import com.ict.home.user.dto.PostUserRes;
import com.ict.home.util.AES128;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import static com.ict.home.exception.BaseResponseStatus.PASSWORD_ENCRYPTION_ERROR;
import static com.ict.home.exception.BaseResponseStatus.POST_USERS_EXISTS_EMAIL;

@EnableTransactionManagement
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * 회원가입
     */
    @Transactional
    public PostUserRes createUser(PostUserReq postUserReq) throws BaseException{
        //이메일 중복 검증
        if (userRepository.findByEmailCount(postUserReq.getEmail()) >= 1) {
            throw new BaseException(POST_USERS_EXISTS_EMAIL);
        }

        //비밀번호 암호화
        String password;
        try {
            password = new AES128(Secret.USER_INFO_PASSWORD_KEY).encrypt(postUserReq.getPassword());
        } catch (Exception exception) {  //암호화 실패 시 에러
            throw new BaseException(PASSWORD_ENCRYPTION_ERROR);
        }

        User user = new User();
        user.createUser(postUserReq.getUsername(), postUserReq.getEmail(), password, postUserReq.getPhoneNumber());
        userRepository.save(user);

        return new PostUserRes(user);
    }
}
