import { createContext, useContext, useEffect, useState } from "react";
import { getUserIdFromToken } from "./api/TokenUtils";

//전역 상태를 공유하는 컨텍스트 객체
const AppContext = createContext();

//Provider 컴포넌트 정의
export const AppProvider = ({ children }) => {
  //로그인 여부 확인
  const [isLogin, setIsLogin] = useState(false);
  //로그인한 유저 id 설정
  const [userId, setUserId] = useState(null);

  //토큰 정보로 로그인 여부와 로그인 아이디 반환하기
  const updateLoginStatus = (token) => {
    if (token) {
      setIsLogin(true);
      setUserId(getUserIdFromToken(token));
    } else {
      setIsLogin(false);
      setUserId(null);
    }
  };

  //토큰 및 유저 ID 초기화
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    updateLoginStatus(token);
  }, []);

  return (
    //<AppContext.Provider>: 상태와 업데이트 함수 등을 자식 컴포넌트에 제공
    //setUserId는 임의로 아이디를 수정할 수 없도록 하기 위해 전역 변수로 리턴하지 않음
    //로그아웃 시 token값이 null이 되므로 전역 변수도 자동으로 null 상태가 됨!
    <AppContext.Provider value={{ isLogin, setIsLogin, userId }}>
      {children}
    </AppContext.Provider>
  );
};

//로그인 상태를 가져오는 커스텀 훅
export const useGlobalContext = () => useContext(AppContext);

export default AppProvider;
