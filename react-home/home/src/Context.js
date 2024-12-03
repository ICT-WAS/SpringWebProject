import { createContext, useContext, useEffect, useState } from "react";

//전역 상태를 공유하는 컨텍스트 객체
const AppContext = createContext();

//Provider 컴포넌트 정의
export const AppProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

  //토큰
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  return (
    //<AppContext.Provider>: 상태와 업데이트 함수 등을 자식 컴포넌트에 제공
    <AppContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </AppContext.Provider>
  );
};

//로그인 상태를 가져오는 커스텀 훅
export const useGlobalContext = () => useContext(AppContext);

export default AppProvider;
