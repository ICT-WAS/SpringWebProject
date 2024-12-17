import { useEffect, useState } from "react";

const RecoveryResult = ({ setErrorTitle, setError }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.removeItem("email");
    } else {
      setErrorTitle("계정 찾기 실패");
      setError(
        "휴대폰 번호에 맞는 계정을 찾을 수 없습니다. 다시 시도해주세요."
      );
    }
  }, []); // 컴포넌트 마운트 시 한 번 실행

  return (
    <div className="info-group-verify">
      <h3>
        인증한 휴대폰 번호와 일치하는
        <br />
        "청약이지" 계정을 확인해 주세요.
      </h3>
      <div className="info-group">
        <div>{email}</div>
      </div>
    </div>
  );
};

export default RecoveryResult;
