import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context";
import { useEffect } from "react";

const KakaoRedirection = () => {
  const code = new URL(document.location.toString()).searchParams.get("code"); //url 뒤의 코드 파라미터만 저장
  const navigate = useNavigate();

  //로그인 상태를 관리하는 전역 변수
  const { setIsLogin } = useGlobalContext();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8989/oauth/kakao/callback",
          code,
          {
            withCredentials: true, //쿠키 포함 요청
          }
        );

        if (response.data.isSuccess) {
          const { accessToken } = response.data.result;
          localStorage.setItem("accessToken", accessToken);
          setIsLogin(true);

          //로그인 성공 시 리다이렉트 - 로그인 성공해도 해당 페이지에 머물러야 할 수 있음, 차후 조건 처리 필요함!
          navigate("/");
        } else {
          // setLoginErrorTitle("로그인 실패");
          // setLoginError(response.data.message);
        }
      } catch (error) {
        // setLoginErrorTitle("로그인 실패");
        // setLoginError("아이디와 비밀번호를 확인하세요.");
      } finally {
        // setLoading(false);
      }
    };
    if (code) {
      handleLogin(); //code 가 있을 때만 로그인 로직 호출
    }
  }, [code, navigate, setIsLogin]);

  return <div>카카오 로그인 중...</div>;
};
export default KakaoRedirection;
