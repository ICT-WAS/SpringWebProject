import { useState } from "react";
import { instance } from "../../api/AxiosInterseptor";

const AccountInputPhoneNumber = ({
  setPhoneNumber,
  userInfo,
  setUserInfo,
  validPhoneNumberError,
  setValidPhoneNumberError,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  //입력 값 변경 핸들러
  const handlePhoneInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "phoneNumber") {
      formattedValue = formatPhoneNumber(value);
      setPhoneNumber(formattedValue);
      checkPhoneNumber(formattedValue); // 유효성 검사 실행
    }

    // userInfo 상태 업데이트
    setUserInfo((prevState) => ({
      ...prevState, // 다른 필드는 기존 상태를 유지하게끔
      [name]: formattedValue,
    }));
  };

  //휴대폰 번호(000-0000-0000) 형식 맞추기
  const formatPhoneNumber = (phoneNumber) => {
    //숫자만 추출
    const onlyNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (onlyNumber.length <= 3) {
      return onlyNumber;
    } else if (onlyNumber.length <= 7) {
      return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
    } else {
      return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(
        3,
        7
      )}-${onlyNumber.slice(7, 11)}`;
    }
  };

  //유저이름 유효성 검사
  const checkPhoneNumber = async (formattedPhoneNumber) => {
    //null 체크
    if (formattedPhoneNumber === "") {
      setValidPhoneNumberError("휴대폰 번호는 필수 항목입니다.");
      setIsValid(false);
      return;
    }

    //형식 검사
    const isValidType = /^01([0-9])-([0-9]{3,4})-([0-9]{4})$/.test(
      formattedPhoneNumber
    );

    if (!isValidType) {
      setValidPhoneNumberError("휴대폰 번호를 정확히 입력해주세요.");
      setIsValid(false);
      return false;
    }

    //중복체크
    setIsChecking(true); //중복 체크 시작
    if (formattedPhoneNumber) {
      instance
        .get(
          `http://localhost:8989/users/check/phone?phone=${formattedPhoneNumber}`
        )
        .then((response) => {
          if (response.data) {
            //response.date=true or false
            setValidPhoneNumberError("이미 사용 중인 휴대폰 번호입니다.");
          } else {
            setValidPhoneNumberError("");
            setIsChecking(true);
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsChecking(false);
        });
    } else {
      // 유효한 경우
      setValidPhoneNumberError("");
      setIsValid(true);
      return true; // 유효성 검사를 통과
    }
  };

  return (
    <>
      <input
        input
        type="text"
        className="info_data_input"
        name="phoneNumber"
        value={userInfo.phoneNumber}
        onChange={handlePhoneInputChange}
      />
      {validPhoneNumberError && (
        <p className="error-message">{validPhoneNumberError}</p>
      )}
    </>
  );
};

export default AccountInputPhoneNumber;
