import { useEffect, useState } from "react";

const Test01 = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetch("http://localhost:8989/users", {
      method: "GET",
      credentials: "include", //쿠키포함설정, 쿠키가 필요 없을 시 해당 행 삭제
    })
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error("네트워크 응답이 OK가 아닙니다.");
      })
      .then((data) => setResponse(data))
      .catch((error) => console.error("Error", error));
  }, []);

  return (
    <div>
      <h1>test</h1>
      <p>: {response}</p>
    </div>
  );
};

export default Test01;
