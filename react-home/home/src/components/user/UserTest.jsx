import React, { useEffect, useState } from "react";
import { instance } from "../../api/AxiosInterceptor";

const UserTest = () => {
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/users/test");
        console.log("받아오는 데이터", response.data);
        setApiResponse(response.data);
      } catch (error) {
        console.log("API 요청 실패:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>test</h1>
      <p>: {apiResponse}</p>
    </div>
  );
};

export default UserTest;

// useEffect(() => {
//   //client가 준비됨(로그인 여부 알아서 판단함), API 요청 보내기
//   if (client) {
//     console.log("client", client);
//     const fetchData = async () => {
//       try {
//         const response = await client.get("/users");
//         console.log("성공:", response.data);
//         setResponse(response.data);
//       } catch (error) {
//         console.error("오류:", error);
//       }
//     };
//     fetchData();
//   } else {
//     console.log("client 준비되지 않음");
//   }
// }, [client]);
