import { useState } from "react";
import "./Signup.css";
import axios from "axios";

const Email = ({ email, setEmail }) => {
  const [error, setError] = useState(""); //오류 메시지
  const [isValid, setIsValid] = useState(true); //유효성
  const [isChecking, setIsChecking] = useState(false); //중복

  const handleChange = (e) => {
    //초기화 함수
    setEmail(e.target.value);
    setIsValid(true);
    setError("");
  };

  const check = async () => {
    //null 체크
    if (email === "") {
      setError("이메일은 필수 항목입니다.");
      setIsValid(false);
      return;
    }

    //형식 검사
    const isValidType = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    );
    if (!isValidType) {
      setError("올바른 이메일 형식을 입력해주세요.");
      setIsValid(false);
      return;
    }

    //중복체크
    setIsChecking(true); //중복 체크 시작
    if (email) {
      axios
        .get(`http://localhost:8989/users/check-email?email=${email}`)
        .then((response) => {
          if (response.data) {
            //response.date=true or false
            setError("이미 사용 중인 이메일입니다.");
          } else {
            setError("");
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsChecking(false);
        });
    } else {
      setError("");
      setIsChecking(false);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onBlur={check}
        onChange={handleChange}
        placeholder="이메일을 입력해주세요."
      />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
};

export default Email;
