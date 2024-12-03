import { useState } from "react";
import "./Signup.css";

const Password = ({ password, setPassword }) => {
  const [error, setError] = useState(""); //오류 메시지
  const [checkError, setCheckError] = useState("");
  const [isValid, setIsValid] = useState(true); //유효성
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleChange = (e) => {
    //초기화 함수
    setPassword(e.target.value);
    setIsValid(true);
    setError("");
    setCheckError("");
  };

  const checkPassword = async () => {
    if (passwordCheck !== password) {
      setCheckError("비밀번호가 다릅니다. ");
      return;
    }
  };

  const check = async () => {
    //null 체크
    if (password === "") {
      setError("비밀번호는 필수 항목입니다.");
      setIsValid(false);
      return;
    }

    //형식 검사
    const isValidType =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(
        password
      );
    if (!isValidType) {
      setError(
        "비밀번호는 8자 이상 16자 이하, 대문자, 숫자, 특수문자를 1개 이상 포함해야 합니다."
      );
      setIsValid(false);
      return;
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="password">비밀번호</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onBlur={check}
        onChange={handleChange}
        placeholder="비밀번호를 입력해주세요."
      />
      {error && <span style={{ color: "red" }}>{error}</span>}
      <div className="form-group">
        <label htmlFor="password-check">비밀번호 확인</label>
        <input
          type="password"
          id="password-check"
          name="password-check"
          onBlur={checkPassword}
          placeholder="비밀번호를 확인해주세요."
        />
        {checkError && <span style={{ color: "red" }}>{checkError}</span>}
      </div>
    </div>
  );
};

export default Password;
