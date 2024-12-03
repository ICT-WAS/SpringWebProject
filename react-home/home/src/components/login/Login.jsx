import { useEffect, useState, useRef } from "react";
import Email from "./Email";
import Password from "./Password";
import "../signup/Signup.css";
import axios from "axios";
import { useGlobalContext } from "../../Context";
import Modal from "../modal/Modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //포커스 상태 관리
  const confirmModalRef = useRef(null);
  const emailRef = useRef(null);

  //로그인
  const [loginError, setLoginError] = useState("");
  const [loginErrorTitle, setLoginErrorTitle] = useState("");
  const [loading, setLoading] = useState(false);
  //로그인 상태를 관리하는 전역 변수
  const { setIsLogin } = useGlobalContext();

  //에러 메시지가 변할 시 모달 출력
  useEffect(() => {
    if (loginError) {
      //loginError 빈문자열 아닐 때만 modal 호출
      setIsModal(true);
    }
  }, [loginError]);

  //모달 닫을 때
  const closeModal = () => {
    setIsModal(false);
    setTimeout(() => {
      if (emailRef.current) {
        emailRef.current.focus();
      }
    }, 100);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); //폼 제출 시 페이지 새로고침
    setLoading(true); //로딩 초기화
    setLoginError(""); //로그인 에러 초기화

    //보낼 데이터
    const postData = {
      email,
      password,
    };

    //경로
    try {
      const response = await axios.post(
        "http://localhost:8989/users/login",
        postData,
        {
          withCredentials: true, //쿠키 포함 요청
        }
      );

      if (response.data.isSuccess) {
        setTimeout(() => {
          //토큰 추출
          const { accessToken } = response.data.result;
          localStorage.setItem("accessToken", accessToken);
          setIsLogin(true);
          //로그인 성공 시 리다이렉트
          window.location.href = "http://localhost:3000";
        }, 500);
      }
    } catch (error) {
      setLoginErrorTitle("로그인 실패");
      setLoginError("아이디와 비밀번호를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-container">
      <div className="form-container">
        <form className="form-container-signin">
          <h2>로그인</h2>
          <Email email={email} setEmail={setEmail} ref={emailRef} />
          <Password password={password} setPassword={setPassword} />
          <button
            type="submit"
            className="submit-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          {isModal && (
            <Modal
              title={loginErrorTitle}
              message={loginError}
              onClose={closeModal}
              ref={confirmModalRef}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
