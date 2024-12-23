import { Container, Stack } from "react-bootstrap";
import React, { useState, useRef } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Modal from "../components/modal/Modal";
import FindEmailByMobile from "../components/find-user/FindEmailByMobile";
import "../components/find-user/FindUser.css";

const FindEmail = () => {
  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);
  //포커스 상태 관리
  const confirmModalRef = useRef(null);
  const phoneRef = useRef(null);
  //에러관리
  const [modalError, setModalError] = useState("");
  const [errorModalTitle, setModalErrorTitle] = useState("");

  //모달 닫을 때
  const closeModal = () => {
    setIsModal(false);
    setTimeout(() => {
      if (phoneRef.current) {
        phoneRef.current.focus();
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
                <h2>계정 찾기</h2>
                <FindEmailByMobile
                  ref={phoneRef}
                  setModalErrorTitle={setModalErrorTitle}
                  setModalError={setModalError}
                />
                {isModal && (
                  <Modal
                    title={errorModalTitle}
                    message={modalError}
                    onClose={closeModal}
                    ref={confirmModalRef}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="body-container">
            <div className="verification-message">
              * 이메일 인증 회원의 경우{" "}
              <a href="/find-password" className="highlight-link">
                비밀번호 찾기
              </a>
              를 이용해 주세요.
            </div>
          </div>
        </div>

        <Footer />
      </Stack>
    </Container>
  );
};

export default FindEmail;
