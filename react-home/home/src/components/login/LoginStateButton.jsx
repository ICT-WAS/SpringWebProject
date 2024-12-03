import { useEffect, useState } from "react";
import { useGlobalContext } from "../../Context";
import { Col, Button } from "react-bootstrap";
import axios from "axios";
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";

const LoginStateButton = () => {
  //로그인 상태를 관리하는 전역 변수
  const { isLogin, setIsLogin } = useGlobalContext();

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //로그아웃
  const [logoutError, setLogoutError] = useState("");
  const [logoutErrorTitle, setLogoutErrorTitle] = useState("");
  const [loading, setLoading] = useState(false);

  //페이지 이동 훅
  const navigate = useNavigate();

  //로그인 페이지 이동
  const handleLgoinClick = () => {
    navigate("/login");
  };

  //회원가입 페이지로 이동
  const handleSignupClick = () => {
    navigate("/signup");
  };

  //에러 메시지가 변할 시 모달 출력
  useEffect(() => {
    if (logoutError) {
      //logoutError 빈문자열 아닐 때만 modal 호출
      setIsModal(true);
    }
  }, [logoutError]);

  //모달 닫을 때
  const closeModal = () => {
    setIsModal(false);
  };

  const handleLogout = async () => {
    setLoading(true); //로딩 초기화
    setLogoutError(""); //로그아웃 에러 초기화

    try {
      //서버 로그아웃 요청
      const response = await axios.post(
        "http://localhost:8989/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.isSuccess) {
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          setIsLogin(false);
          window.location.href = "http://localhost:3000";
        }, 500);
      }
    } catch (error) {
      setLogoutErrorTitle("로그아웃 실패");
      setLogoutError("다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLogin ? (
        <>
          <Col md="auto">
            <p className="nav-bar-links">
              <Button variant="dark" onClick={handleLogout}>
                {loading ? "로그아웃 중..." : "로그아웃"}
              </Button>
            </p>
          </Col>
        </>
      ) : (
        <>
          <Col md="auto">
            <p className="nav-bar-links">
              <Button variant="light" onClick={handleLgoinClick}>
                로그인
              </Button>
            </p>
          </Col>

          <Col md="auto">
            <p className="nav-bar-links">
              <Button variant="dark" onClick={handleSignupClick}>
                회원가입
              </Button>
            </p>
          </Col>
        </>
      )}
      {isModal && (
        <Modal
          title={logoutErrorTitle}
          message={logoutError}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default LoginStateButton;
