import { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Modal from "../../components/modal/Modal";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SendVerification = () => {
  //이전 화면에서 넘어오는 데이터
  const verificationData = localStorage.getItem("verificationData");
  const verificationType = localStorage.getItem("verificationType");

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //에러
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  //인증관련
  const [verificationCode, setVerificationCode] = useState(""); //사용자가 입력하는 인증 코드
  const [timer, setTimer] = useState(60 * 10); // 10분 타이머
  const [isTimerActive, setIsTimerActive] = useState(false); //타이머 활성화 상태
  const [isCodeSent, setIsCodeSent] = useState(false); //인증 코드 전송 여부
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState("");

  //네비게이트
  const navigate = useNavigate();

  //데이터 삭제
  const location = useLocation();

  //초기화 함수
  useEffect(() => {
    setError("");
  }, []);

  //사용자에게 보여질 마스킹 데이터
  const handleVerificationData = () => {
    let maskedData = "";

    if (verificationType === "EMAIL") {
      maskedData = maskEmail(verificationData);
    } else if (verificationType === "PHONE") {
      maskedData = maskPhoneNumber(verificationData);
    }

    return maskedData;
  };

  // 이메일 또는 전화번호를 설정할 변수
  let email = "";
  let phoneNumber = "";

  // verificationType에 따라서 이메일과 전화번호 설정
  if (verificationType === "EMAIL") {
    email = verificationData;
    phoneNumber = "";
  } else if (verificationType === "PHONE") {
    phoneNumber = verificationData;
    email = "";
  }

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
    await sendVerification(email, phoneNumber, verificationType);
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
        let response;
        if (verificationType === "EMAIL") {
          response = await axios.post(
            "http://localhost:8989/auth/verify/email",
            {
              email: verificationData,
              verificationCode: inputCode, //사용자가 입력한 코드
            }
          );
        }
        if (verificationType === "PHONE") {
          response = await axios.post(
            "http://localhost:8989/auth/verify/mobile",
            {
              phoneNumber: verificationData,
              verificationCode: inputCode, //사용자가 입력한 코드
            }
          );
        }

        //성공 응답 처리
        if (response.data.isSuccess) {
          setIsVerified(true); //인증 성공
          setError(""); //오류 메시지 제거
          setIsTimerActive(false); //타이머 종료
        }

        navigate("/find-password/reset");
      } catch (error) {
        setErrorTitle("인증 요청 실패");
        setError("다시 시도해주세요. - ", error);
      }
    } else {
      setErrorTitle("인증 실패");
      setError("인증 코드가 일치하지 않습니다."); //오류 메시지 출력
    }
  };

  //언마운트 시 이전 화면에서 넘겨준 데이터 삭제
  useEffect(() => {
    return () => {
      localStorage.removeItem("verificationData");
      localStorage.removeItem("verificationType");
    };
  }, [location]);

  //모달 닫을 때
  const closeModal = () => {
    setIsModal(false);
  };

  // 00:00 시간 형식으로 변환하는 함수
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
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

  //이메일 마스킹
  const maskEmail = (email) => {
    const atIndex = email.indexOf("@");
    if (atIndex > 2) {
      const username = email.substring(0, atIndex); // @ 앞 부분
      const maskedUsername = username.slice(0, username.length - 2) + "**"; // 마지막 2자리를 **로 마스킹
      return maskedUsername + email.substring(atIndex); // 마스킹된 사용자명과 @뒤를 결합
    }
    return email;
  };

  //휴대폰 마스킹
  const maskPhoneNumber = (phoneNumber) => {
    const parts = phoneNumber.split("-");
    if (parts.length === 3) {
      return (
        parts[0] +
        "-" +
        parts[1].substring(0, 2) +
        "**" +
        "-" +
        parts[2].substring(0, 2) +
        "**"
      );
    }
    return phoneNumber;
  };

  return (
    <Container className="p-5" fluid="md">
      <Stack direction="vertical" gap={5}>
        <Header />
        <div>
          <div className="body-container">
            <div className="info-container">
              <div className="info-container-area">
                <h2>비밀번호 찾기</h2>
                <div className="info-group">
                  <div className="description">
                    {handleVerificationData()} 로(으로) 인증하기
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClick}
                  className="next-button"
                >
                  {isVerified
                    ? "인증 완료"
                    : isTimerActive
                    ? "인증 중"
                    : "인증하기"}
                </button>
                <div className="info-group-verify">
                  {isCodeSent &&
                    !isVerified && ( //인증 완료 시 입력 필드 숨김
                      <div className="info-group">
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
                {isModal && (
                  <Modal
                    title={errorTitle}
                    message={error}
                    onClose={closeModal}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="body-container">
            <div
              className="verification-message"
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              인증 완료 후 비밀번호 재설정이 가능합니다.
            </div>
          </div>
        </div>
        <Footer />
      </Stack>
    </Container>
  );
};
export default SendVerification;
