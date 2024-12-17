package com.ict.home.user.service;

import com.ict.home.exception.BaseException;
import com.ict.home.exception.BaseResponse;
import com.ict.home.exception.BaseResponseStatus;
import com.ict.home.login.auth.dto.PostVerifiedUserRes;
import com.ict.home.login.auth.model.Verification;
import com.ict.home.login.auth.repository.VerificationRepository;
import com.ict.home.login.jwt.JwtProvider;
import com.ict.home.login.jwt.Secret;
import com.ict.home.login.jwt.Token;
import com.ict.home.login.jwt.TokenRepository;
import com.ict.home.user.dto.*;
import com.ict.home.user.enums.UserVerify;
import com.ict.home.user.repository.UserRepository;

import com.ict.home.user.User;
import com.ict.home.util.AES128;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.WebUtils;

import java.time.LocalDateTime;

import static com.ict.home.exception.BaseResponseStatus.*;

import static com.ict.home.exception.BaseResponseStatus.PASSWORD_ENCRYPTION_ERROR;
import static com.ict.home.exception.BaseResponseStatus.POST_USERS_EXISTS_EMAIL;

@Slf4j
@EnableTransactionManagement
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtProvider jwtProvider;
    private final UserUtilService userUtilService;
    private final VerificationRepository verificationRepository;

    /**
     * 회원가입
     */
    @Transactional
    public PostUserRes createUser(PostUserReq postUserReq) throws BaseException {
        //이메일 중복 검증
        if (userRepository.existsByEmail(postUserReq.getEmail())) {
            throw new BaseException(POST_USERS_EXISTS_EMAIL);
        }

        String password = encryptPassword(postUserReq.getPassword());

        //인증 테이블(Verification) 상태 확인 - 이메일 혹은 휴대전화 인증정보가 있는지 확인
        if (postUserReq.getVerificationCode() != null) {
            Verification verification = checkVerification(postUserReq.getEmail(), postUserReq.getPhoneNumber(), postUserReq.getVerificationCode());

            //인증 정보에서 인증 완료가 아닐 시 에러
            if (!verification.isVerified()) {
                throw new BaseException(VERIFICATION_FAILED);
            }
        }

        //사용자 정보 생성
        User user = new User();
        user.createUser(postUserReq.getUsername(), postUserReq.getEmail(), password, postUserReq.getPhoneNumber());
        switch (postUserReq.getVerificationType()) {
            case "EMAIL":
                user.setUserVerify(UserVerify.EMAIL_VERIFIED);
                break;
            case "PHONE":
                user.setUserVerify(UserVerify.PHONE_VERIFIED);
                break;
            default:
                //인증 타입이 잘못되었을 시 예외
                throw new BaseException(INVALID_VERIFICATION_TYPE);
        }
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
                refreshToken = checkRefreshTokenExpire(token, user);  //현재 유저의 리프레시 토큰
            } else {
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

            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            //유저 정보와 액세스토큰을 담은 객체를 클라이언트에 반환
            return new PostLoginRes(user, accessToken);
        } else {
            throw new BaseException(FAILED_TO_LOGIN);
        }
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
        } else {
            throw new BaseException(FAILED_TO_LOGOUT);
        }
    }

    /**
     * 이메일 찾기 - 인증된 핸드폰으로 찾기
     */
    public String findEmailByPhoneNumber(String phoneNumber) {
        //데이터베이스에 있는 회원일 시
        User user = userUtilService.findByPhoneNumberValidation(phoneNumber);

        //핸드폰 인증 회원이 아닐 경우
        if (user.getUserVerify() != UserVerify.PHONE_VERIFIED) {
            throw new BaseException(BaseResponseStatus.PHONE_VERIFICATION_FAILED);
        }

        //핸드폰 인증 회원일 경우
        return user.getEmail();
    }

    /**
     * email 로 인증 정보 찾기
     */
    public PostVerifiedUserRes getVerifiedUserByEmail(String email) {
        User user = userUtilService.findByEmailWithValidation(email);
        PostVerifiedUserRes postVerifiedUserRes = new PostVerifiedUserRes();

        switch (user.getUserVerify()) {
            case EMAIL_VERIFIED -> {
                postVerifiedUserRes.setVerifiedData(user.getEmail());
            }
            case PHONE_VERIFIED -> {
                postVerifiedUserRes.setVerifiedData(user.getPhoneNumber());
            }
            default -> throw new BaseException(POST_USERS_NONE_EXISTS_EMAIL);
        }

        postVerifiedUserRes.setUserVerify(user.getUserVerify().getUserVerifyInKorea());
        return postVerifiedUserRes;
    }

    /**
     * 비밀번호 재설정
     */
    @Transactional
    public String resetPassword(PostResetPasswordReq postResetPasswordReq) {
        User user = userUtilService.findByUserIdValidation(postResetPasswordReq.getUserId());
        String encryptedPassword = encryptPassword(postResetPasswordReq.getPassword());

        if (user.getPassword().equals(encryptedPassword)) {
            throw new BaseException(SAME_AS_OLD_PASSWORD_ERROR);
        }

        user.setPassword(encryptedPassword);
        userRepository.save(user);

        return "비밀번호가 성공적으로 변경되었습니다.";
    }

    /**
     * 회원 탈퇴
     */

    /**
     * 회원정보 불러오기
     */

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

    //리프레시 토큰의 만료 확인 후 사용자 정보에 맞는 유저 반환
    public String checkRefreshTokenExpire(Token token, User user) {
        //1. 만료 되었을 시
        if (token.isExpired()) {
            //1-1. 기존 리프레시 토큰 삭제
            tokenRepository.deleteByUserId(user.getId());

            //1-2. 리프레시 토큰을 재발급 후 저장 및 반환
            return createAndSaveRefreshToken(user);
        } else {
            //2. 만료되지 않았을 시 - 기존 리프레시 토큰을 반환
            return token.getRefreshToken();
        }
    }

    //액세스 토큰 발급 - 재발급 시 사용
    public String createAccessToken(Long userId) {
        log.info("재발급 로직 탔음~!!! userId:{}", userId);
        User user = userUtilService.findByIdWithValidation(userId);

        if (user == null) {
            throw new BaseException(POST_USERS_NONE_EXISTS_ID);
        }

        Token token = tokenRepository.findByUserId(userId);
        if (token == null) {
            throw new BaseException(TOKEN_NOT_FOUND_IN_USER);
        }

        //리프레시 토큰의 만료 확인 후 사용자 정보에 맞는 리프레시 토큰 반환
        String refreshToken = checkRefreshTokenExpire(token, user);

        String accessToken = null;
        if (refreshToken != null) {
            accessToken = jwtProvider.createAccessToken(user);
        }
        return accessToken;
    }

    //리프레시 토큰 발급 및 저장
    public String createAndSaveRefreshToken(User user) {
        String refreshToken = jwtProvider.createRefreshToken(user);

        Token token = Token.builder()
                .refreshToken(refreshToken)
                .user(user)
                .build();
        tokenRepository.save(token);
        return refreshToken;
    }

    //비밀번호 암호화
    private static String encryptPassword(String password) {

        try {
            return new AES128(Secret.USER_INFO_PASSWORD_KEY).encrypt(password);
        } catch (Exception exception) {  //암호화 실패 시 에러
            throw new BaseException(PASSWORD_ENCRYPTION_ERROR);
        }
    }

    //인증 테이블 생성 확인
    private Verification checkVerification(String email, String phoneNumber, String verificationCode) {
        //인증여부 확인
        Verification verification = verificationRepository.findByEmailAndVerificationCode(email, verificationCode).orElse(null);

        //이메일 인증이 없을 경우 핸드폰 인증 확인
        if (verification == null || !verification.isVerified()) {
            verification = verificationRepository.findByPhoneNumberAndVerificationCode(phoneNumber, verificationCode).orElse(null);
        }

        //핸드폰 인증까지 확인한 후에도 null 이거나 인증 완료 여부가 false일 시
        if (verification == null || !verification.isVerified()) {
            return null;
        }
        //휴대폰 인증 확인 시 반환
        return verification;
    }

    //이메일 가리기
    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex > 2) {
            return email.substring(0, 2) + "**" + email.substring(atIndex);
        }
        return email;
    }

    //핸드폰 번호 가리기
    private String maskPhoneNumber(String phoneNumber) {
        String[] parts = phoneNumber.split("-"); // "-"로 분리
        if (parts.length == 3) {
            return parts[0] + "-" + parts[1].substring(0, 2) + "**" + "-" + parts[2].substring(0, 2) + "**";
        }
        return phoneNumber;
    }
}
