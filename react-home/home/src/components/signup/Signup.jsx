import { useEffect, useState } from "react";
import "./Signup.css";
import axios from "axios";
import Email from "./Email";
import Password from "./Password";
import Username from "./Username";
import Phone from "./phone";
import Modal from "../modal/Modal";

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
  };

  //회원가입 버튼 클릭
  const handleSignup = async (e) => {
    e.preventDefault(); //폼 제출 시 페이지 새로고침
    setLoading(true); //로딩 초기화
    setSignupError(""); //회원가입 에러 초기화

    //보낼 데이터
    const postData = {
      email,
      password,
      phoneNumber,
      username,
    };

    //경로
    try {
      const response = await axios.post(
        "http://localhost:8989/users",
        postData
      );

      if (response.data.success) {
        alert("회원가입 성공");
        setTimeout(() => {
          window.location.href = "http://localhost:3000/login";
        }, 500);
      }
    } catch (error) {
      setSignupError("입력하신 정보를 다시 확인해주세요.");
      setSignupErrorTitle("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          />
        )}
      </form>
    </div>
  );
};

export default Signup;
