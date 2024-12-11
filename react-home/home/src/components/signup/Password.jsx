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
  };

  const handleChangeCheck = (e) => {
    setPasswordCheck(e.target.value);
  };

  const checkPassword = async () => {
    if (passwordCheck !== password) {
      console.log(password);
      console.log(passwordCheck);
      setCheckError("비밀번호가 다릅니다. ");
      return;
    } else if (passwordCheck === password) {
      setCheckError("");
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
        id="signup-password"
        name="signup-password"
        value={password}
        onBlur={check}
        onChange={handleChange}
        placeholder="비밀번호를 입력해주세요."
      />
      {error && <span className="error-message">{error}</span>}
      <div className="form-group" style={{ marginTop: "6px" }}>
        <label htmlFor="password-check">비밀번호 확인</label>
        <input
          type="password"
          id="password-check"
          name="password-check"
          value={passwordCheck}
          onBlur={checkPassword}
          onChange={handleChangeCheck}
          placeholder="비밀번호를 확인해주세요."
        />
        {checkError && <span className="error-message">{checkError}</span>}
      </div>
    </div>
  );
};

export default Password;
