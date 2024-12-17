import Password from "../../components/signup/Password";
import { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Modal from "../../components/modal/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  //이전 화면에서 넘어오는 데이터
  const userId = localStorage.getItem("userId");

  //패스워드 설정
  const [password, setPassword] = useState("");

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //에러
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  //네비게이트
  const navigate = useNavigate();

  //데이터 삭제
  const location = useLocation();

  //초기화 함수
  useEffect(() => {
    setError("");
  }, []);

  const sendResetPasswordReq = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8989/users/reset/password",
        {
          userId,
          password,
        }
      );

      //성공 응답 처리
      if (response.data.isSuccess) {
        alert(response.data.result);
        navigate("/login");
      }
    } catch (error) {
      setErrorTitle("변경 실패");
      setError("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  //버튼 클릭 핸들러
  const handleClick = async () => {
    await sendResetPasswordReq();
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

  return (
    <Container className="p-5" fluid="md">
      <Stack direction="vertical" gap={5}>
        <Header />
        <div>
          <div className="body-container">
            <div className="info-container">
              <div className="info-container-area">
                <h2>비밀번호 재설정</h2>
                <Password
                  bgColor="#f8f9fa"
                  password={password}
                  setPassword={setPassword}
                />
                <button
                  type="button"
                  className="next-button"
                  onClick={handleClick}
                >
                  재설정
                </button>

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
        </div>
        <Footer />
      </Stack>
    </Container>
  );
};

export default ResetPassword;
