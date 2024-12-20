import { Button, Col } from "react-bootstrap";
import "../components/account/account.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Context";
import { instance } from "../api/AxiosInterseptor";

const UserInfoAndConditionDetails = ({ setError, setErrorTitle }) => {
  //로그인 상태를 관리하는 전역 변수
  const { userId } = useGlobalContext();

  //네비게이트
  const navigate = useNavigate();

  //내 조건이 없는 경우를 위한 조건
  //내 조건을 가져오는 api 처리 시 false 변경 요망
  const [isConditionNull, setIsConidionNull] = useState(true);

  //사용자 정보를 저장할 상태 변수
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

  const handleClickToEdit = () => {
    navigate("/mypage/account/edit");
  };

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  return (
    <>
      <section className="sec_3">
        <div className="user_form_main" style={{ height: "auto" }}>
          <div className="no-hover">
            <ul className="information_list">
              <li>
                <div className="info_flex_one">
                  <h2>내 조건</h2>
                </div>
              </li>
              {isConditionNull ? (
                <li>
                  <div className="info_flex_one">
                    <p className="info_subtitle2">조건을 등록해 주세요.</p>
                  </div>
                </li>
              ) : (
                <>
                  <li>
                    <div className="info_flex_one">
                      <p className="info_subtitle2">조건 종류</p>
                      <p className="info_data_text2">
                        {"내 조건이 들어갑니다"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="info_flex_one">
                      <p className="info_subtitle2">조건 종류</p>
                      <p className="info_data_text2">
                        {"내 조건이 들어갑니다"}
                      </p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <Col md="auto" className="d-flex justify-content-end">
          <div className="d-flex gap-4">
            <Button type="button" variant="light">
              내 조건 수정
            </Button>
            <Button type="submit" variant="dark">
              내 조건 등록
            </Button>
          </div>
        </Col>
      </section>
      <section className="sec_3">
        <div className="user_form_main" style={{ height: "auto" }}>
          <div className="no-hover">
            <ul className="information_list">
              <li>
                <div className="info_flex_one">
                  <h2>내 정보</h2>
                </div>
              </li>
              <li>
                <div className="info_flex_one">
                  <p className="info_subtitle2">이름</p>
                  <p className="info_data_text2">{userInfo.username}</p>
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
                  <p className="info_data_text2">{userInfo.phoneNumber}</p>
                  {userInfo.userVerify &&
                  userInfo.userVerify === "핸드폰 인증" ? (
                    <p className="info_data_text3">인증됨</p>
                  ) : null}
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
        <Col md="auto" className="d-flex justify-content-end">
          <p className="nav-bar-links">
            <Button type="button" variant="dark" onClick={handleClickToEdit}>
              내 정보 수정
            </Button>
          </p>
        </Col>
      </section>
    </>
  );
};

export default UserInfoAndConditionDetails;
