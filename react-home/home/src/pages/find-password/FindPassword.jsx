import { Container, Stack } from "react-bootstrap";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import "../../components/find-user/FindUser.css";
import Modal from "../../components/modal/Modal";

const FindPassword = () => {
  //유효성
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState(""); //이메일
  const [validationError, setValidationError] = useState(""); //오류 메시지

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //포커스 상태 관리
  const confirmModalRef = useRef(null);
  const emailRef = useRef(null);

  //에러
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  //네비게이트
  const navigate = useNavigate();

  const check = (email) => {
    if (email === "") {
      setValidationError("");
      setIsValid(false);
      return;
    }

    const isValidType = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    );
    if (!isValidType) {
      setValidationError("올바른 이메일 형식을 입력해주세요.");
      setIsValid(false);
      return;
    }

    // 유효한 경우
    setValidationError("");
    setIsValid(true);
  };

  // 실시간으로 값이 변할 때마다 체크
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    check(value);
  };

  const handleClick = async (e) => {
    e.preventDefault(); //폼 제출 시 페이지 새로고침
    try {
      const response = await axios.post(
        "http://localhost:8989/users/find/verification",
        email,
        { headers: { "Content-Type": "text/plain" } }
      );

      if (response.data.isSuccess) {
        localStorage.setItem(
          "verificationData",
          response.data.result.verifiedData
        );
        if (response.data.result.userVerify === "이메일 인증") {
          localStorage.setItem("verificationType", "EMAIL");
        } else if (response.data.result.userVerify === "핸드폰 인증") {
          localStorage.setItem("verificationType", "PHONE");
        }
        navigate("/find-password/verify");
      }
    } catch (error) {
      setErrorTitle("정보 없음");
      setError("이메일을 다시 확인해주세요.");
    }
  };

  //모달 닫을 때
  const closeModal = () => {
    setIsModal(false);
    setTimeout(() => {
      if (emailRef.current) {
        emailRef.current.focus();
      }
    }, 100);
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
                    비밀번호를 찾고자하는 이메일을 입력해주세요.
                  </div>
                  <input
                    type="text"
                    value={email}
                    ref={emailRef}
                    onChange={handleEmailChange}
                    placeholder="청약이지 이메일"
                  ></input>
                  <div
                    className={`error-message-small ${
                      validationError ? "visible" : ""
                    }`}
                  >
                    {validationError}
                  </div>
                </div>
                <button
                  type="submit"
                  className="next-button"
                  disabled={!isValid}
                  onClick={handleClick}
                >
                  다음
                </button>
                {isModal && (
                  <Modal
                    title={errorTitle}
                    message={error}
                    onClose={closeModal}
                    ref={confirmModalRef}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="body-container">
            <div className="verification-message">
              이메일이 떠오르지 않으세요?{"  "}
              <a href="/find-email" className="highlight-link">
                이메일 찾기
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </Stack>
    </Container>
  );
};

export default FindPassword;
