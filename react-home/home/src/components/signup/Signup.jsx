import { useEffect, useState } from "react";
import "./Signup.css";
import axios from "axios";
import Email from "./Email";
import Password from "./Password";
import Username from "./Username";
import Phone from "./phone";

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
  const [phoneNumberError, setPhoneNumberError] = useState("");

  //회원가입
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  //핸드폰 중복확인
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value) {
      axios
        .get(`http://localhost:8989/users/check-phone?phone=${value}`)
        .then((response) => {
          if (response.data) {
            //response.date=true or false
            setPhoneNumberError("이미 사용 중인 핸드폰 번호입니다.");
          } else {
            setPhoneNumberError("");
          }
        })
        .catch((error) => console.error(error));
    } else {
      setPhoneNumberError("");
    }
  };

  //회원가입 버튼 클릭
  const handleSignup = async (e) => {
    e.preventDefault(); //폼 제출 시 페이지 새로고침
    setLoading(true); //로딩 초기화
    setLoginError(""); //로그인 에러 초기화

    const postData = {
      email,
      password,
      phoneNumber,
      username,
    };

    try {
      const response = await axios.post(
        "http://localhost:8989/users",
        postData
      );

      if (response.data.success) {
        alert("회원가입 성공");
        setTimeout(() => {
          window.location.href = "http://localhost:8989";
        }, 500);
      }
    } catch (error) {
      setLoginError("회원가입 실패: " + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form className="form-container-signin">
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
      </form>
    </div>
  );
};

export default Signup;
