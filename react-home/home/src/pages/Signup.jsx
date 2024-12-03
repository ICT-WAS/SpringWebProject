import { useEffect, useState, useRef } from "react";
import "../components/signup/Signup.css";
import axios from "axios";
import Email from "../components/signup/Email";
import Password from "../components/signup/Password";
import Username from "../components/signup/Username";
import Phone from "../components/signup/phone";
import Modal from "../components/modal/Modal";
import { useGlobalContext } from "../Context";
import { useNavigate } from "react-router-dom";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  //회원가입
  const [signupError, setSignupError] = useState("");
  const [singupErrorTitle, setSignupErrorTitle] = useState("");
  const [loading, setLoading] = useState(false);

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);
  const confirmModalRef = useRef(null);

  //로그인 상태를 관리하는 전역 변수
  const { setIsLogin } = useGlobalContext();

  //페이지 이동 훅
  const navigate = useNavigate();

  //로그인 페이지 이동
  const handleLoginPage = () => {
    navigate("/login");
  };

  //메인 페이지 이동
  const handleMainPage = () => {
    navigate("/");
  };

  //에러 메시지 출력
  useEffect(() => {
    if (signupError) {
      //signupError 빈문자열 아닐 때만 modal 호출
      setIsModal(true);
    }
  }, [signupError]);

  //모달 닫기
  const closeModal = () => {
    setIsModal(false);
    setSignupError("");
  };

  //회원가입 버튼 클릭
  const handleSignup = async (e) => {
    e.preventDefault(); //폼 제출 시 페이지 새로고침
    setLoading(true); //로딩 초기화
    setSignupError(""); //회원가입 에러 초기화

    //회원가입 요청 시 보낼 데이터
    const SignupData = {
      email,
      password,
      phoneNumber,
      username,
    };

    try {
      //1. 회원가입 요청
      const response = await axios.post(
        "http://localhost:8989/users",
        SignupData
      );

      //1-1. 회원가입 실패
      if (response.data.IsSuccess === false) {
        console.log(response.data.IsSuccess);
        setSignupErrorTitle("회원가입 실패");
        setSignupError("입력하신 정보를 확인하세요.");
        return;
      }

      //2. 회원가입 성공
      alert("회원가입 성공");

      //3. 로그인 요청
      const { email, password } = SignupData;
      const loginData = { email, password };
      const loginResponse = await axios.post(
        "http://localhost:8989/users/login",
        loginData,
        {
          withCredentials: true, //쿠키 포함 요청
        }
      );

      //3-1. 로그인 실패 - 로그인 페이지로 이동
      if (loginResponse.data.success === false) {
        setSignupErrorTitle("자동 로그인 실패");
        setSignupError("다시 로그인 해주세요.");
        handleLoginPage();
        return;
      }

      //4. 로그인 성공
      const { accessToken } = response.data.result;
      localStorage.setItem("accessToken", accessToken);
      setIsLogin(true);

      //4-1. 메인 페이지 리다이렉트 / 상태 초기화
      setEmail("");
      setPassword("");
      setUsername("");
      setPhoneNumber("");
      handleMainPage();
    } catch (error) {
      setSignupError("입력하신 정보를 다시 확인해주세요.");
      setSignupErrorTitle("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-container">
      <div className="form-container">
        <form className="form-container-signin">
          <h2>회원가입</h2>
          <Email email={email} setEmail={setEmail} />
          <Password password={password} setPassword={setPassword} />
          <Username username={username} setUsername={setUsername} />
          <Phone phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
          <button
            type="submit"
            className="submit-button"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
          {isModal && (
            <Modal
              title={singupErrorTitle}
              message={signupError}
              onClose={closeModal}
              ref={confirmModalRef}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
