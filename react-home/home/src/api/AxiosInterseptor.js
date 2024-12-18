import { refreshTokenIfExpired } from "./TokenUtils";
import axios from "axios";

//Axios 정보 설정
const instance = axios.create({
  baseURL: "http://localhost:8989",
  timeout: 10000,
  withCredentials: true,
});

let failedQueue = [];
let isRefreshing = false;

//요청 실패 시 대기 큐 처리
const procssQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = []; //큐 초기화
};

//요청 인터셉터 설정 - 로그인 시 헤더에 항상 엑세스 토큰을 포함하고 쿠키 포함 요청을 허용해주어야 함
instance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("accessToken");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`; //토큰을 헤더에 추가
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => {
    //1. 응답이 정상이면 응답을 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config; //error 구성 정보 저장

    //2. 인증 실패(401)일 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      //토큰 갱신 중 대기 큐 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // 새로운 토큰으로 원래 요청 재시도
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      //토큰 갱신 시작
      originalRequest._retry = true; //재시도 플래그 설정
      isRefreshing = true; //갱신 시작

      try {
        const accessToken = localStorage.getItem("accessToken");
        const newToken = await refreshTokenIfExpired(accessToken); //토큰 만료 확인 후 재발급 및 재설정

        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          procssQueue(null, newToken); //대기 중인 요청들에 새로운 토큰 전달

          return instance(originalRequest); //원래 요청 재시도
        }
      } catch (tokenError) {
        procssQueue(tokenError, null); //에러 발생 시 대기 큐에 에러 처리
        return Promise.reject(tokenError); //토큰 발급 실패 시 에러 반환
      } finally {
        isRefreshing = false; //갱신 완료
      }
    }

    return Promise.reject(error); //401 외 다른 오류는 그대로 반환
  }
);
export { instance };
