import { Container, Stack } from "react-bootstrap";
import { useState, useRef } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Modal from "../components/modal/Modal";
import "../components/find-user/FindUser.css";
import RecoveryResult from "../components/find-user/RecoveryResult";

const EmailRecoveryResult = () => {
  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);
  //포커스 상태 관리
  const confirmModalRef = useRef(null);
  const emailRef = useRef(null);
  //에러관리
  const [loginError, setError] = useState("");
  const [loginErrorTitle, setErrorTitle] = useState("");

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
                <h2>계정 확인</h2>
                <RecoveryResult
                  setError={setError}
                  setErrorTitle={setErrorTitle}
                />
                <button type="submit" className="submit-button">
                  로그인
                </button>
                {isModal && (
                  <Modal
                    title={loginErrorTitle}
                    message={loginError}
                    onClose={closeModal}
                    ref={confirmModalRef}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="body-container">
            <div className="verification-message">
              비밀번호가 떠오르지 않으세요?{"  "}
              <a href="/password-reset" className="highlight-link">
                비밀번호 찾기
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </Stack>
    </Container>
  );
};

export default EmailRecoveryResult;
