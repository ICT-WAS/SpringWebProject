package com.ict.home.user;

import com.ict.home.exception.BaseException;
import com.ict.home.login.jwt.JwtProvider;
import com.ict.home.login.jwt.Secret;
import com.ict.home.login.jwt.Token;
import com.ict.home.login.jwt.TokenRepository;
import com.ict.home.user.dto.PostLoginReq;
import com.ict.home.user.dto.PostLoginRes;

import com.ict.home.user.dto.PostUserReq;
import com.ict.home.user.dto.PostUserRes;
import com.ict.home.util.AES128;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.WebUtils;

import java.time.LocalDateTime;

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
    @Transactional
    public PostLoginRes localLogin(PostLoginReq postLoginReq, HttpServletResponse response) {
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

            //액세스 토큰 발급
            String accessToken = jwtProvider.createAccessToken(user);

            String refreshToken;
            //유저와 연결된 리프레시 토큰 존재 확인
            if (tokenRepository.existsByUserId(user.getId())) {
                //리프레시  토큰이 있는 경우
                Token token = tokenRepository.findByUserId(user.getId());
                //리프레시 토큰의 만료 확인 후 반환 or 발급
                refreshToken = CheckRefreshTokenExpire(token, user);  //현재 유저의 리프레시 토큰
            }else {
                //리프레시 토큰이 없는 경우 - 리프레시 토큰 발급 후 디비 저장
                refreshToken = createAndSaveRefreshToken(user);
            }

            //리프레시 토큰을 HTTP-Only 쿠키에 할당 -> 클라이언트에서 접근 불가
            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);  //Javascript 에서 접근 불가
            refreshTokenCookie.setSecure(false);  //true: HTTPS 에서만 전송
            refreshTokenCookie.setPath("/");  //모든 경로에서 쿠키 사용 가능
            refreshTokenCookie.setMaxAge(60 * 60 * 24 * 15);  //15일 유효

            response.addCookie(refreshTokenCookie);

            //유저 정보와 액세스토큰을 담은 객체를 클라이언트에 반환
            return new PostLoginRes(user, accessToken);
        } else {
            throw new BaseException(FAILED_TO_LOGIN);
        }
    }

    //리프레시 토큰의 만료 확인 후 사용자 정보에 맞는 유저 반환
    private String CheckRefreshTokenExpire(Token token, User user) {
        //1. 만료 되었을 시
        if (token.isExpired()) {
            //1-1. 기존 리프레시 토큰 삭제
            tokenRepository.deleteByUserId(user.getId());

            //1-2. 리프레시 토큰을 재발급 후 저장 및 반환
            return createAndSaveRefreshToken(user);
        } else{
            //2. 만료되지 않았을 시 - 기존 리프레시 토큰을 반환
            return token.getRefreshToken();
        }
    }

    //액세스 토큰 발급 - 재발급 시 사용
    public String createAccessToken(Long userId) {
        User user = userUtilService.findByIdWithValidation(userId);
        
        if (user == null) {
            throw new BaseException(POST_USERS_NONE_EXISTS_ID);
        }

        Token token = tokenRepository.findByUserId(userId);
        if (token == null) {
            throw new BaseException(TOKEN_NOT_FOUND_IN_USER);
        }

        //리프레시 토큰의 만료 확인 후 사용자 정보에 맞는 유저 반환
        return CheckRefreshTokenExpire(token, user);
    }

    //리프레시 토큰 발급 및 저장
    private String createAndSaveRefreshToken(User user) {
        String refreshToken = jwtProvider.createRefreshToken(user);
        
        Token token = Token.builder()
                .refreshToken(refreshToken)
                .user(user)
                .build();
        tokenRepository.save(token);
        return refreshToken;
    }

    /**
     * 로그아웃
     */
    @Transactional
    public String logout(HttpServletRequest request, HttpServletResponse response) throws BaseException {
        //쿠키에서 리프레시 토큰 찾기
        Cookie refreshTokenCookie = WebUtils.getCookie(request, "refreshToken");

        //리프레시 토큰이 잘 넘어올 시
        if (refreshTokenCookie != null) {
            //쿠키에서 리프레시 토큰 삭제
            refreshTokenCookie.setValue(null);
            refreshTokenCookie.setPath("/");  //도메인에 맞는 경로??????==>>???
            refreshTokenCookie.setMaxAge(0);  //쿠키 만료 처리
            refreshTokenCookie.setHttpOnly(true);  //클라이언트에서 쿠키 접근 불가
            refreshTokenCookie.setHttpOnly(false);  //로컬 환경이기 때문에 일단 false

            //리셋한 쿠키를 응답에 추가, 클라이언트에서 삭제
            response.addCookie(refreshTokenCookie);

            //로그아웃 성공 후 클라이언트 상태 갱신
            return "logoutSuccess";
        } else{
            throw new BaseException(FAILED_TO_LOGOUT);
        }
    }

    /**
     * 비동기 처리를 위한 email, 휴대폰 번호, 유저 이름 중복 체크
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
