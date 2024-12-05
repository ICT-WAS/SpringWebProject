import { useEffect, useState } from "react";
import { useGlobalContext } from "../Context";
import { refreshTokenIfExpired } from "./TokenUtils";

const { default: axios } = require("axios");

//Axios 정보 설정
const AplClient = axios.create({
  baseURL: "http://localhost:8989",
  timeout: 10000,
});

//요청 인터셉터 설정 - 로그인 시 헤더에 항상 엑세스 토큰을 포함하고 쿠키 포함 요청을 허용해주어야 함
const setupInterceptor = (isLogin) => {
  AplClient.interceptors.request.use(
    (config) => {
      if (isLogin) {
        const token = localStorage.getItem("accessToken");

        if (token) {
          const accessToken = refreshTokenIfExpired(token); //토큰 만료 확인 후 재발급 및 재설정
          config.headers["Authorization"] = `Bearer ${accessToken}`; //토큰을 헤더에 추가
        }

        //쿠키 포함 요청 허용
        config.withCredentials = true;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const useAplClient = () => {
  const { isLogin } = useGlobalContext();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setupInterceptor(isLogin);
    setClientReady(true);
  }, [isLogin]); //로그인 상태 변경될 시 인터셉터 설정 갱신

  return clientReady ? AplClient : null;
};
