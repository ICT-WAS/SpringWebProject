import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Stack,
} from "react-bootstrap";
import { getUserIdFromToken } from "../api/TokenUtils";
import { useNavigate } from "react-router-dom";
import UserInfoAndConditionDetails from "./UserInfoAndConditionDetails";
import Modal from "../components/modal/Modal";

export default function MyPageContent() {
  const navigate = useNavigate();

  //모달 상태 관리
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

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

  function onConditionButtonClick() {
    navigate("/conditions");
  }

  return (
    <>
      <p className="heading-text">마이페이지</p>
      <Stack direction="vertical" gap={5}>
        <UserInfoAndConditionDetails
          setError={setError}
          setErrorTitle={setErrorTitle}
        />

        <p className="heading-text">모아보기</p>
        <Container fluid>
          <Row>
            <Col>
              <MyMenuCard
                name={"찜한 공고"}
                total={21}
                iClassName={"bi-suit-heart"}
              />
            </Col>
            <Col>
              <MyMenuCard
                name={"내가 쓴 글"}
                total={1}
                iClassName={"bi-feather"}
              />
            </Col>
            <Col>
              <MyMenuCard
                name={"내가 쓴 댓글"}
                total={3}
                iClassName={"bi-chat-left-dots"}
              />
            </Col>
          </Row>
        </Container>
      </Stack>
      {isModal && (
        <Modal title={errorTitle} message={error} onClose={closeModal} />
      )}
    </>
  );
}

function MyMenuCard({ name, total, iClassName }) {
  return (
    <>
      <Card>
        <Button className="btn-mypage-card" style={{ textAlign: "left" }}>
          <CardBody>
            <p className="heading-text">
              {name}
              <br />
            </p>
            <b>
              <i
                className={`bi ${iClassName}`}
                style={{ fontSize: "2.5rem" }}
              />
            </b>
            <span className="px-4 ">{total}건</span>
          </CardBody>
        </Button>
      </Card>
    </>
  );
}

function ConditionButton({ onClick }) {
  const [hasCondition, setHasCondition] = useState(false);

  const token = localStorage.getItem("accessToken");
  const userId = getUserIdFromToken(token);

  const fetchCondition = () => {
    axios
      .get(`http://localhost:8989/condition/${userId}`)
      .then((response) => {
        setHasCondition(response.data.hasCondition);
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
      });
  };

  useEffect(() => {
    fetchCondition();
  }, []);

  return (
    <>
      <Button variant="dark" onClick={onClick}>
        {hasCondition ? "조건 확인" : "조건 등록"}
      </Button>
    </>
  );
}
