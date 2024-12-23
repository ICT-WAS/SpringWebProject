import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const refreshTokenIfExpired = async (token) => {
  //1. 토큰에 값이 없을 시 임의료 만료 처리
  if (!token) {
    return true;
  }

  //2. 토큰에 값이 있을 시
  try {
    //2-1. 토큰 디코딩
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    //만료일이 현재 시간보다 이전일 시(만료 되었을 시)
    if (decodedToken.exp < currentTime) {
      const newToken = await refreshAccessToken(token).then();

      if (newToken) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", newToken);
        //새로 설정한 토큰을 반환
        return newToken;
      }
    }
    //만료되지 않았을 시 기존 토큰 반환
    return token;
  } catch (error) {
    console.error("토큰 디코딩 및 재발급 오류", error);
  }
};

//토큰에서 유저Id 가져오기 (디버깅 완료)
export const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    return userId;
  } catch (error) {
    return null;
  }
};

//서버에 액세스 토큰 재발급 API 호출
const refreshAccessToken = async (token) => {
  try {
    const userId = getUserIdFromToken(token);
    console.log("액세스 토큰 만료, 재발급");

    const response = await axios.post(
      `http://localhost:8989/users/check/access-token/reset?userId=${userId}`,
      userId,
      { withCredentials: true } // 쿠키 포함, 리프레시 토큰을 함께 보냄
    );

    const accessToken = response.data.result;
    if (response.data.isSuccess) {
      localStorage.setItem("accessToken", accessToken);
    }
    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//로그인 한 유저 아이디 가져오기
export const getUserId = () => {
  try {
    //로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("현재 로그인 된 사용자가 없습니다.");
      return null;
    }

    //토큰에서 유저 id 추출
    const userId = getUserIdFromToken(token);

    if (!userId) {
      console.warn("유효한 유저 ID를 토큰에서 찾을 수 없습니다.");
      return null;
    }
    return userId;
  } catch (error) {
    console.error("유저 id 가져오는 중 오류 발생:", error);
    return null;
  }
};
