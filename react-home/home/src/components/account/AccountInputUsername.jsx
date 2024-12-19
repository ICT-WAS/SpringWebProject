import { useState } from "react";
import { instance } from "../../api/AxiosInterseptor";

const AccountInputUsername = ({
  setUsername,
  userInfo,
  setUserInfo,
  validUsernameError,
  setValidUsernameError,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  //입력 값 변경 핸들러
  const handleUsernameInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
      checkUsername(value); // 유효성 검사 실행
    }

    // userInfo 상태 업데이트
    setUserInfo((prevState) => ({
      ...prevState, // 다른 필드는 기존 상태를 유지하게끔
      [name]: value,
    }));
  };

  //유저이름 유효성 검사
  const checkUsername = async (username) => {
    //null 체크
    if (username === "") {
      setValidUsernameError("사용자 이름은 필수 항목입니다.");
      setIsValid(false);
      return;
    }

    //형식 검사
    const isValidType = /^.{2,11}$/.test(username);
    if (!isValidType) {
      setValidUsernameError("사용자 이름은 2자 이상 12자 미만입니다.");
      setIsValid(false);
      return;
    }

    //중복체크
    setIsChecking(true); //중복 체크 시작
    if (username) {
      instance
        .get(`http://localhost:8989/users/check/username?username=${username}`)
        .then((response) => {
          if (response.data) {
            //response.date=true or false
            setValidUsernameError("이미 사용 중인 이름입니다.");
          } else {
            setValidUsernameError("");
            setIsChecking(true);
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsChecking(false);
        });
    } else {
      // 유효한 경우
      setValidUsernameError("");
      setIsValid(true);
      return true; // 유효성 검사를 통과
    }
  };

  return (
    <>
      <input
        type="text"
        className="info_data_input"
        name="username"
        value={userInfo.username}
        onChange={handleUsernameInputChange}
      />
      {validUsernameError && (
        <p className="error-message">{validUsernameError}</p>
      )}
    </>
  );
};

export default AccountInputUsername;
