import { Container, Stack } from "react-bootstrap";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import UserInfoDetailsEdit from "../../components/account/UserInfoDetailsEdit";
import { useState } from "react";

const UserInfoEdit = () => {
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  return (
    <>
      <Container className="p-5" fluid="md">
        <Stack direction="vertical" gap={5}>
          <Header />
          <UserInfoDetailsEdit
            setError={setError}
            setErrorTitle={setErrorTitle}
          />
          <Footer />
        </Stack>
      </Container>
    </>
  );
};

export default UserInfoEdit;
