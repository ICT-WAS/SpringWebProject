import { useState } from "react";
import "./Signup.css";
import axios from "axios";

const Phone = ({ phoneNumber, setPhoneNumber }) => {
  const [error, setError] = useState(""); //오류 메시지
  const [isValid, setIsValid] = useState(true); //유효성
  const [isChecking, setIsChecking] = useState(false); //중복

  const handleChange = (e) => {
    //초기화 함수
    setPhoneNumber(e.target.value);
    setIsValid(true);
    setError("");
    //형식 체크
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  const check = async () => {
    //null 체크
    if (phoneNumber === "") {
      setError("휴대폰 번호는 필수 항목입니다.");
      setIsValid(false);
      return;
    }

    //형식 검사
    const isValidType = /^01([0-9])-([0-9]{3,4})-([0-9]{4})$/.test(phoneNumber);
    if (!isValidType) {
      setError("휴대폰 번호를 정확히 입력해주세요.");
      setIsValid(false);
      return;
    }

    //중복체크
    setIsChecking(true); //중복 체크 시작
    if (phoneNumber) {
      axios
        .get(`http://localhost:8989/users/check-phone?phone=${phoneNumber}`)
        .then((response) => {
          if (response.data) {
            //response.date=true or false
            setError("이미 사용 중인 휴대폰 번호입니다.");
          } else {
            setError("");
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsChecking(false);
        });
    } else {
      setError("");
      setIsChecking(false);
    }
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

  return (
    <div className="form-group-phone">
      <label htmlFor="phoneNumber">휴대폰 번호</label>
      <div className="input-group">
        <input
          type="phoneNumber"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onBlur={check}
          onChange={handleChange}
          placeholder="휴대폰 번호를 입력해주세요."
        />
        <button type="submit" className="phone-auth-button">
          인증하기
        </button>
      </div>
      {error && (
        <span className="error-message" style={{ color: "red" }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Phone;
