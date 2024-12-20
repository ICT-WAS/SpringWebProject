import { useState, useEffect } from "react";
import "./Signup.css";
import axios from "axios";

const Email = ({
  email,
  setEmail,
  isVerified,
  setIsVerified,
  code,
  setCode,
  setVerificationType,
}) => {
  const [error, setError] = useState(""); //오류 메시지
  const [isValid, setIsValid] = useState(true); //유효성
  const [isChecking, setIsChecking] = useState(false); //중복

  //인증관련
  const [verificationCode, setVerificationCode] = useState(""); //사용자가 입력하는 인증 코드
  const [timer, setTimer] = useState(60 * 10); // 10분 타이머
  const [isTimerActive, setIsTimerActive] = useState(false); //타이머 활성화 상태
  const [isCodeSent, setIsCodeSent] = useState(false); //인증 코드 전송 여부

  const handleChange = (e) => {
    //초기화 함수
    setEmail(e.target.value);
    setIsValid(true);
    setError("");
  };

  //인증 요청을 보내는 함수
  const sendVerification = async (email, phoneNumber, verificationType) => {
    try {
      const response = await axios.post("http://localhost:8989/auth/signup", {
        email,
        phoneNumber,
        verificationType,
      });

      //성공 응답 처리
      if (response.data.isSuccess) {
        setIsCodeSent(true); //인증 코드 전송
        setIsTimerActive(true); //타이머 시작
        setCode(response.data.result);
        return response.data.result;
      }
    } catch (error) {
      console.error("인증 요청 실패:", error);
    }
  };

  //인증 버튼 클릭 핸들러
  const handleClick = async () => {
    if (isTimerActive) return; //타이머 활성화 상태 재전송 방지
    await sendVerification(email, "", "EMAIL");
  };

  const verificationCodeChange = async (e) => {
    const inputCode = e.target.value.toUpperCase();
    //사용자 입력 인증코드 업데이트
    setVerificationCode(inputCode);

    if (/^[A-Z0-9]{6}$/.test(inputCode)) {
      await handleCodeCheck(inputCode);
    }
  };

  //인증코드 일치 여부 확인 함수
  const handleCodeCheck = async (inputCode) => {
    //사용자가 입력한 6자리 인증 코드가 서버에서 받아온 코드와 일치하는지 확인
    if (inputCode === code) {
      try {
        const response = await axios.post("http://localhost:8989/auth/verify", {
          verificationCode: inputCode, //사용자가 입력한 코드
          email,
          phoneNumber: "",
          verificationType: "EMAIL",
        });

        //성공 응답 처리
        if (response.data.isSuccess) {
          setIsVerified(true); //인증 성공
          setError(""); //오류 메시지 제거
          setIsTimerActive(false); //타이머 종료
          setVerificationType("EMAIL");
          return response.data.result;
        }
      } catch (error) {
        console.error("인증 요청 실패:", error);
      }
    } else {
      setError("인증 코드가 일치하지 않습니다."); //오류 메시지 출력
    }
  };

  //이메일 유효성 검사 및 중복 체크
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
        .get(`http://localhost:8989/users/check/email?email=${email}`)
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

  // 타이머 업데이트
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1); // 1초마다 타이머 감소
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsTimerActive(false); // 타이머 종료
    }

    // 컴포넌트 unmount 시 카운트 인터벌 클리어
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // 00:00 시간 형식으로 변환하는 함수
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="form-group-phone">
      <label htmlFor="phoneNumber">Email</label>
      <div className="input-group">
        <input
          type="email"
          id="signup-email"
          name="signup-email"
          value={email}
          onBlur={check}
          onChange={handleChange}
          placeholder="이메일을 입력해주세요."
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={isVerified || isTimerActive}
        >
          {isVerified ? "인증 완료" : isTimerActive ? "인증 중" : "인증하기"}
        </button>
      </div>
      {error && <span className="error-message">{error}</span>}

      {isCodeSent &&
        !isVerified && ( //인증 완료 시 입력 필드 숨김
          <div className="form-group">
            <div className="input-group">
              <input
                className="verify"
                type="text"
                value={verificationCode}
                onChange={verificationCodeChange}
                placeholder="인증 번호 입력"
                disabled={!isTimerActive || isVerified} // 타이머 종료 혹은 인증 완료 시 입력 불가
                style={{
                  width: "100%",
                  paddingRight: "60px", // 타이머 공간을 위해 오른쪽 여백
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "14px",
                  color: isTimerActive ? "black" : "red", // 타이머 활성화 상태에 따른 색상
                }}
              >
                {isTimerActive
                  ? `${formatTime(timer)}`
                  : "인증 시간이 만료되었습니다."}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Email;
