import { createContext, useContext, useState } from "react";

//전역 상태를 공유하는 컨텍스트 객체
const AppContext = createContext();

//Provider 컴포넌트 정의
export const AppProvider = ({ children }) => {
  const [value, setValue] = useState("");

  return (
    //<AppContext.Provider>: 상태와 업데이트 함수 등을 자식 컴포넌트에 제공
    <AppContext.Provider value={{ value, setValue }}>
      {children}
    </AppContext.Provider>
  );
};

//로그인 사용자를 담는 Context 객체
export const useGlobalContext = () => useContext(AppContext);

export default AppProvider;
