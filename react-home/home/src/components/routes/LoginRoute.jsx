import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../Context";
import { useEffect, useState } from "react";

const LoginRoute = ({ children }) => {
  //로그인 상태 가져오기 - 전역변수
  const { isLogin } = useGlobalContext();
  const [isLoginChecked, setIsLoginChecked] = useState(true); // 로그인 상태 체크 완료 플래그 추가

  useEffect(() => {
    if (isLogin !== undefined) {
      setIsLoginChecked(true); // 로그인 상태 체크 완료
    }
  }, [isLogin]);

  if (!isLoginChecked) {
    return null; // 로그인 상태가 확정될 때까지 아무 것도 렌더링하지 않음
  }

  if (isLogin) {
    // alert("접근 권한이 없습니다.");
    //로그인하지 않으면 로그인 페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children; //로그인하지 않은 경우 요청한 페이지 렌더링
};

export default LoginRoute;
