import { useEffect, useState } from "react";
import "./logo.css";
import axios from "axios";

const NaverLogin = () => {
  const [clientId, setClientId] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  //state를 위한 난수 생성
  const state = `${Math.random().toString(36).substring(2, 15)}${Date.now()}`;

  useEffect(() => {
    const fetchNaverLoginData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8989/oauth/naver/data"
        );
        const data = response.data.result;

        setClientId(data.clientId);
        setRedirectUri(data.redirectUri);
      } catch (error) {
        console.error("네이버 접근 정보를 가져오는 데 실패했습니다.", error);
      }
    };
    fetchNaverLoginData();
  }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    if (clientId && redirectUri) {
      const link = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
      window.location.href = link;
    }
  };

  return (
    <div className="form-group">
      <a href="" className="signup_btn green_bg sns_1" onClick={loginHandler}>
        네이버 로그인
      </a>
    </div>
  );
};

export default NaverLogin;
