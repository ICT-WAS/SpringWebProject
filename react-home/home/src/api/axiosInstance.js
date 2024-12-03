const { default: axios } = require("axios");

//Axios 정보 설정
const aplClient = axios.create({
  baseURL: "http://localhost:8989",
  timeout: 10000,
});

//요청 인터셉터 설정 - 로그인 시 헤더에 항상 엑세스 토큰을 포함하여야 함
aplClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default aplClient;
