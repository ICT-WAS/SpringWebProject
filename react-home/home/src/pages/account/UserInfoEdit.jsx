import { Container, Modal, Stack } from "react-bootstrap";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import UserInfoDetailsEdit from "../../components/account/UserInfoDetailsEdit";
import { useEffect, useState } from "react";

const UserInfoEdit = () => {
  //에러 내용 관리
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //에러 메시지가 변할 시 모달 출력
  useEffect(() => {
    if (error) {
      //loginError 빈문자열 아닐 때만 modal 호출
      setIsModal(true);
    }
  }, [error]);

  //모달 닫을 때
  const closeModal = () => {
    setIsModal(false);
  };
  return (
    <>
      <Container className="p-5" fluid="md">
        <Stack direction="vertical" gap={5}>
          <Header />
          <UserInfoDetailsEdit
            setError={setError}
            setErrorTitle={setErrorTitle}
          />
          {isModal && (
            <Modal title={errorTitle} message={error} onClose={closeModal} />
          )}
          <Footer />
        </Stack>
      </Container>
    </>
  );
};

export default UserInfoEdit;
