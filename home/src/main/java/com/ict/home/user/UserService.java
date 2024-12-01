package com.ict.home.user;

import com.ict.home.exception.BaseException;
import com.ict.home.login.dto.JwtResponseDto;
import com.ict.home.login.jwt.JwtProvider;
import com.ict.home.login.jwt.Secret;
import com.ict.home.login.jwt.Token;
import com.ict.home.login.jwt.TokenRepository;
import com.ict.home.user.dto.PostLoginReq;
import com.ict.home.user.dto.PostLoginRes;

import com.ict.home.user.dto.PostUserReq;
import com.ict.home.user.dto.PostUserRes;
import com.ict.home.util.AES128;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import static com.ict.home.exception.BaseResponseStatus.*;

import static com.ict.home.exception.BaseResponseStatus.PASSWORD_ENCRYPTION_ERROR;
import static com.ict.home.exception.BaseResponseStatus.POST_USERS_EXISTS_EMAIL;


@EnableTransactionManagement
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtProvider jwtProvider;
    private final UserUtilService userUtilService;

    /**
     * 회원가입
     */
    @Transactional
    public PostUserRes createUser(PostUserReq postUserReq) throws BaseException {
        //이메일 중복 검증
        if (userRepository.existsByEmail(postUserReq.getEmail())) {
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

    /**
     * 로그인
     */
    public PostLoginRes localLogin(PostLoginReq postLoginReq) {
        //유저 검색
        User user = userUtilService.findByEmailWithValidation(postLoginReq.getEmail());

        //유저의 비밀번호 복호화
        String password;
        try {
            password = new AES128(Secret.USER_INFO_PASSWORD_KEY).decrypt(user.getPassword());
        } catch (Exception e) {
            throw new BaseException(PASSWORD_DECRYPTION_ERROR);
        }

        //DB에 저장된 유저의 비밀번호(password)와 입력받은 비밀번호(postLoginReq.getPassword())가 동일할 시
        if (postLoginReq.getPassword().equals(password)) {
            JwtResponseDto jwtResponseDto = new JwtResponseDto();

            //액세스 토큰 발급
            String accessToken = jwtProvider.createAccessToken(user);
            jwtResponseDto.setAccessToken(accessToken);

            //리프레시 토큰 발급
            String refreshToken = jwtProvider.createRefreshToken(user);
            jwtResponseDto.setRefreshToken(refreshToken);

            //리프레시 토큰만 DB 저장
            Token token = Token.builder()
                    .refreshToken(jwtResponseDto.getRefreshToken())
                    .user(user)
                    .build();
            tokenRepository.save(token);

            //유저 정보와 액세스토큰, 리프레시토큰을 담은 객체 반환
            return new PostLoginRes(user, jwtResponseDto);
        } else {
            throw new BaseException(FAILED_TO_LOGIN);
        }
    }

    /**
     * 비동기 처리를 위한 email 중복 체크
     */
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean checkPhoneNumberExists(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }
}
