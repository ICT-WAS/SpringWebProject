import { Button, Col } from "react-bootstrap";
import "./account.css";
import { useGlobalContext } from "../../Context";
import { instance } from "../../api/AxiosInterseptor";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountInputUsername from "./AccountInputUsername";
import AccountInputPhoneNumber from "./AccountInputPhoneNumber";

const UserInfoDetailsEdit = ({ setError, setErrorTitle, ClickDeleteUser }) => {
  //로그인 상태를 관리하는 전역 변수
  const { userId } = useGlobalContext();
  //수정된 값을 담을 변수
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  //초기 버튼 disabled 를 위한 값 변경 감지 변수
  const [isModified, setIsModified] = useState(false);
  //네비게이트
  const navigate = useNavigate();
  //자식 컴포넌트 유효성 에러 확인
  const [validUsernameError, setValidUsernameError] = useState("");
  const [validPhoneNumberError, setValidPhoneNumberError] = useState("");

  //초기화 함수
  useEffect(() => {
    setError("");
  }, []);

  // 사용자 정보를 저장할 상태 변수
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    userVerify: "",
    socialLinks: [],
  });

  //userId 있을 때 초기값 가져오기
  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, []);

  //초기값 가져오는 함수
  const getUserInfo = async () => {
    try {
      const response = await instance.get(`/users`, {
        params: { userId: userId },
      });

      if (response.data.isSuccess) {
        setUserInfo({
          username: response.data.result.username,
          email: response.data.result.email,
          phoneNumber: response.data.result.phoneNumber,
          userVerify: response.data.result.userVerify,
          socialLinks: response.data.result.socialLinks || [],
        });
      }
    } catch (error) {
      setErrorTitle("정보 가져오기 실패");
      setError("다시 시도해주세요.");
    }
  };

  //정보 수정하기
  const handleUpdateUser = async () => {
    try {
      const response = await instance.post(`/users/update`, {
        //이메일은 어떤 경우에도 수정될 수 없음
        userId: userId,
        username: userInfo.username,
        phoneNumber: userInfo.phoneNumber,
      });
      alert(response.data.result);
    } catch (error) {
      setErrorTitle("정보 수정 실패");
      setError("입력 값을 확인하고 다시 시도해주세요.");
    }
  };

  const handleClickToMypage = () => {
    navigate("/mypage");
  };

  // username과 phoneNumber 값이 변경되었는지 감지
  useEffect(() => {
    if (username || phoneNumber) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [username, phoneNumber]);

  //디버깅용
  useEffect(() => {
    // console.log("username 변경됨", userInfo.username);
  }, [userInfo.username]);

  return (
    <>
      <p className="heading-text">내 정보 수정</p>
      <section className="sec_3">
        <div className="user_form_main" style={{ height: "auto" }}>
          <div className="no-hover">
            <ul className="information_list">
              <li>
                <div className="info_flex_one">
                  <p className="info_subtitle2">이름</p>
                  <AccountInputUsername
                    setUsername={setUsername}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    setValidUsernameError={setValidUsernameError}
                    validUsernameError={validUsernameError}
                  />
                </div>
              </li>
              <li>
                <div className="info_flex_one">
                  <p className="info_subtitle2">이메일</p>
                  <p className="info_data_text2">{userInfo.email}</p>
                  {userInfo.userVerify &&
                  userInfo.userVerify === "이메일 인증" ? (
                    <p className="info_data_text3">인증됨</p>
                  ) : null}
                </div>
              </li>
              <li>
                <div className="info_flex_one">
                  <p className="info_subtitle2">휴대폰 번호</p>

                  {userInfo.userVerify &&
                  userInfo.userVerify === "휴대폰 인증" ? (
                    <>
                      <p className="info_data_text2">{userInfo.phoneNumber}</p>
                      <p className="info_data_text3">인증됨</p>
                    </>
                  ) : (
                    <AccountInputPhoneNumber
                      setPhoneNumber={setPhoneNumber}
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                      validPhoneNumberError={validPhoneNumberError}
                      setValidPhoneNumberError={setValidPhoneNumberError}
                    />
                  )}
                </div>
              </li>
              <li>
                <div className="info_flex_one">
                  <p className="info_subtitle2">소셜 연동</p>
                  <p className="info_data_text2">
                    {userInfo.socialLinks && userInfo.socialLinks.length > 0
                      ? userInfo.socialLinks.slice(0, 2).map((item, index) => (
                          <span key={index}>
                            {item}
                            {index < userInfo.socialLinks.length - 1 && ", "}
                          </span>
                        ))
                      : "없음"}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <Col
            md="auto"
            className="d-flex justify-content-between align-items-center"
          >
            <p className="info-small-text" onClick={ClickDeleteUser}>
              회원 탈퇴
            </p>
            <div className="d-flex gap-4">
              <Button
                type="button"
                variant="light"
                onClick={handleClickToMypage}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="dark"
                disabled={
                  !isModified || validPhoneNumberError || validUsernameError
                }
                onClick={handleUpdateUser}
              >
                수정
              </Button>
            </div>
          </Col>
        </div>
      </section>
    </>
  );
};

export default UserInfoDetailsEdit;
