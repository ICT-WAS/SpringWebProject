import { Container, Stack } from "react-bootstrap";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import UserInfoDetailsEdit from "../../components/account/UserInfoDetailsEdit";
import { useEffect, useState } from "react";
import InfoCheckModal from "../../components/modal/InfoCheckModal";
import { useGlobalContext } from "../../Context";
import { instance } from "../../api/AxiosInterseptor";
import InfoModal from "../../components/modal/InfoModal";
import { useNavigate } from "react-router-dom";

const UserInfoEdit = () => {
  //로그인 상태를 관리하는 전역 변수
  const { userId, setIsLogin } = useGlobalContext();
  //에러 내용 관리
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  //모달 상태 관리
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isDeleteUserModal, setIsDeleteUserModal] = useState(false);
  const navigate = useNavigate;

  //에러 메시지가 변할 시 모달 출력
  useEffect(() => {
    if (error) {
      setIsErrorModal(true);
    }
  }, [error]);

  //에러 모달 닫음
  const closeErrorModal = () => {
    setIsErrorModal(false);
    setError("");
    setErrorTitle("");
  };

  //회원 탈퇴 모달 닫기
  const closeDeleteUserModal = () => {
    setIsDeleteUserModal(false);
  };

  //회원 탈퇴 모달 열기
  const openDeleteUserModal = () => {
    setIsDeleteUserModal(true);
  };

  //회원 탈퇴 버튼 누름
  const ClickDeleteUser = async () => {
    try {
      const response = await instance.post(
        `/users/delete`,
        {},
        {
          params: { userId: userId },
        }
      );

      if (response.data.isSuccess) {
        alert(response.data.result);
        localStorage.removeItem("accessToken");
        setIsLogin(false);
        navigate("/");
      }
    } catch (error) {
      setErrorTitle("회원 탈퇴 실패");
      setError("다시 시도해주세요.");
    }

    setIsDeleteUserModal(false);
  };

  return (
    <>
      <Container className="p-5" fluid="md">
        <Stack direction="vertical" gap={5}>
          <Header />
          <UserInfoDetailsEdit
            setError={setError}
            setErrorTitle={setErrorTitle}
            ClickDeleteUser={openDeleteUserModal}
          />

          {isErrorModal && (
            <InfoModal
              title={errorTitle}
              message={error}
              onClose={closeErrorModal}
            />
          )}
          {isDeleteUserModal && (
            <InfoCheckModal
              title="회원 탈퇴"
              infoFirst="회원 탈퇴 후 1년 동안 개인정보가 보존됩니다."
              infoSecond="탈퇴 후 1년간 동일 이메일로 재가입이 제한됩니다."
              onClickSubmit={ClickDeleteUser}
              onClose={closeDeleteUserModal}
            />
          )}
          <Footer />
        </Stack>
      </Container>
    </>
  );
};

export default UserInfoEdit;
