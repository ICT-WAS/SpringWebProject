import { Button, Col } from "react-bootstrap";
import "./account.css";
import { useGlobalContext } from "../../Context";
import { instance } from "../../api/AxiosInterseptor";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserInfoDetailsEdit = ({ setError, setErrorTitle }) => {
  //로그인 상태를 관리하는 전역 변수
  const { userId } = useGlobalContext();

  //네비게이트
  const navigate = useNavigate();

  // 사용자 정보를 저장할 상태 변수
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    userVerify: "",
    socialLinks: [],
  });

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

  const handleClick = () => {
    navigate("/mypage/account");
  };

  // 입력 값 변경 핸들러
  const handleNameInputChange = (e) => {
    const { name, value } = e.target;

    // userInfo 상태 업데이트
    setUserInfo((prevState) => ({
      ...prevState, // 다른 필드는 기존 상태를 유지하게끔
      [name]: value, // 변경된 값을 해당 name 이라는 새로운 필드로 할당
    }));
  };

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  // useEffect로 상태 변화 추적(디버깅용)
  useEffect(() => {
    // console.log("username 변경됨", userInfo.username);
  }, [userInfo.username]); // userInfo.username이 변경될 때마다 실행

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
                  <input
                    type="text"
                    className="info_data_text2"
                    name="username"
                    value={userInfo.username}
                    onChange={handleNameInputChange}
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
                  <p className="info_subtitle2">핸드폰 번호</p>

                  {userInfo.userVerify &&
                  userInfo.userVerify === "휴대폰 인증" ? (
                    <>
                      <p className="info_data_text2">{userInfo.phoneNumber}</p>
                      <p className="info_data_text3">인증됨</p>
                    </>
                  ) : (
                    <input
                      input
                      type="text"
                      className="info_data_text2"
                      value={userInfo.phoneNumber}
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
            <p className="info-small-text">회원 탈퇴</p>
            <div className="d-flex gap-4">
              <Button type="button" variant="light" onClick={handleClick}>
                취소
              </Button>
              <Button type="submit" variant="dark">
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
