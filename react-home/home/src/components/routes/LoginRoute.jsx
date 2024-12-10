import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginRoute = ({ children }) => {
  //로그인 상태 가져오기 - 전역변수
  const [isLoginChecked, setIsLoginChecked] = useState(false); // 로그인 상태 체크 완료 플래그 추가
  const [hasAlertShown, setHasAlertShown] = useState(false); // 이미 알림을 표시했는지 확인하는 상태
  const navigate = useNavigate(); // useNavigate 훅으로 리다이렉트
  const location = useLocation(); // 현재 경로를 확인
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token !== undefined) {
      setIsLoginChecked(true); // 로그인 상태 체크 완료
    }
  }, [token]);

  useEffect(() => {
    if (token && location.pathname === "/login" && !hasAlertShown) {
      setHasAlertShown(true); // 리다이렉트 플래그 활성화
      window.alert("이미 로그인 하셨습니다."); // 확인/취소 창 띄움
      navigate("/"); // 알림 후 메인 페이지로 리다이렉트
    }
  }, [token, hasAlertShown, location.pathname, navigate]);

  if (!isLoginChecked) {
    return null; // 로그인 상태가 확정될 때까지 아무 것도 렌더링하지 않음
  }

  // if (isLogin && shouldRedirect) {
  //   return <Navigate to="/" replace />;
  // }

  return children; //로그인하지 않은 경우 요청한 페이지 렌더링
};

export default LoginRoute;
