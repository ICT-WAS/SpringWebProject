import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const CheckTokenExpired = (token) => {
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
      const newToken = refreshAccessToken(token);
      if (newToken) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", newToken);
      }
    }
    //만료되지 않았을 시 아무런 변화 없음
  } catch (error) {
    console.error("토큰 디코딩 및 재발급 오류", error);
  }
};

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub;
    return userId;
  } catch (error) {
    return null;
  }
};

const refreshAccessToken = async (token) => {
  try {
    //서버에 액세스 토큰 재발급 API 호출
    const userId = getUserIdFromToken(token);

    const response = await axios.post(
      "http://localhost:8989/users/access-token/reset",
      { userId },
      { withCredentials: true } // 쿠키 포함
    );

    if (response.data.isSuccess) {
      const { accessToken } = response.data.result;
      localStorage.setItem("accessToken", accessToken);
    }
  } catch (error) {
    return null;
  }
};
