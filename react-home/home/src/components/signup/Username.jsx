import { useState } from "react";
import "./Signup.css";
import axios from "axios";

const Username = ({ username, setUsername }) => {
  const [error, setError] = useState(""); //오류 메시지
  const [isValid, setIsValid] = useState(true); //유효성
  const [isChecking, setIsChecking] = useState(false); //중복

  const handleChange = (e) => {
    //초기화 함수
    setUsername(e.target.value);
    setIsValid(true);
    setError("");
  };

  const check = async () => {
    //null 체크
    if (username === "") {
      setError("사용자 이름은 필수 항목입니다.");
      setIsValid(false);
      return;
    }

    //형식 검사
    const isValidType = /^.{2,11}$/.test(username);
    if (!isValidType) {
      setError("사용자 이름은 2자 이상 12자 미만입니다.");
      setIsValid(false);
      return;
    }

    //중복체크
    setIsChecking(true); //중복 체크 시작
    if (username) {
      axios
        .get(`http://localhost:8989/users/check-username?username=${username}`)
        .then((response) => {
          if (response.data) {
            //response.date=true or false
            setError("이미 사용 중인 이름입니다.");
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
      <label htmlFor="username">이름</label>
      <input
        type="username"
        id="username"
        name="username"
        value={username}
        onBlur={check}
        onChange={handleChange}
        placeholder="사용자 이름을 입력해주세요."
      />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
};

export default Username;
