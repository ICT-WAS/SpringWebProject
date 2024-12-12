import { useEffect, useState } from "react";
import "./logo.css";
import axios from "axios";

const KakaoLogin = () => {
  const [clientId, setClientId] = useState("");
  const [redirectUri, setRedirectUri] = useState("");

  useEffect(() => {
    const fetchKakaoLoginData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8989/oauth/kakao/data"
        );
        const data = response.data.result;

        setClientId(data.clientId);
        setRedirectUri(data.redirectUri);
      } catch (error) {
        console.error("카카오 접근 정보를 가져오는 데 실패했습니다.", error);
      }
    };
    fetchKakaoLoginData();
  }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    if (clientId && redirectUri) {
      const link = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
      window.location.href = link;
    }
  };

  return (
    <div className="form-group">
      <a href="" className="signup_btn yellow_bg sns_2" onClick={loginHandler}>
        카카오 로그인
      </a>
    </div>
  );
};

export default KakaoLogin;
