import { Container, Stack } from "react-bootstrap";
import UserInfoDetails from "../../components/account/UserInfoDetails";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useState } from "react";

const UserInfo = () => {
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  return (
    <>
      <Container className="p-5" fluid="md">
        <Stack direction="vertical" gap={5}>
          <Header />
          <UserInfoDetails setError={setError} setErrorTitle={setErrorTitle} />
          <Footer />
        </Stack>
      </Container>
    </>
  );
};

export default UserInfo;
