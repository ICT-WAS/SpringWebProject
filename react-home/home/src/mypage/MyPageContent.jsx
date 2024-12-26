import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../api/TokenUtils";
import axios from "axios";

export default function MyPageContent() {
  const token = localStorage.getItem("accessToken");
  const userId = getUserIdFromToken(token);
  const [interests, setInterests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  function fetchInterest(userId) {
    axios
      .get(`http://localhost:8989/interest/${userId}`)
      .then((response) => {
        setInterests(response.data);
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
      });
  }

  function fetchPosts(userId) {
    axios
      .get(`http://localhost:8989/community/posts/${userId}`)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
      });
  }

  function fetchComments(userId) {
    axios
      .get(`http://localhost:8989/community/comments/${userId}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
      });
  }

  useEffect(() => {
    fetchInterest(userId);
    fetchPosts(userId);
    fetchComments(userId);
  }, [userId]);

  return (
    <>
      <Stack direction="vertical" gap={5} style={{ marginBottom: "100px" }}>
        <p className="heading-text">마이페이지</p>
        <Container fluid>
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <MyMenuCard
                name={"개인 정보"}
                text={"개인 정보 확인 및 변경"}
                iClassName={"bi-person"}
                url={"/mypage/account"}
              />
            </Col>
            <Col>
              <MyMenuCard
                name={"내 조건"}
                text={"신청자 및 세대구성원 정보 관리"}
                iClassName={"bi-person-gear"}
                url={"/conditions"}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <MyMenuCard
                name={"관심 공고"}
                text={interests.length + " 건"}
                iClassName={"bi-suit-heart"}
                url={"/interest"}
              />
            </Col>
            <Col>
              <MyMenuCard
                name={"내가 쓴 글"}
                text={posts.length + " 건"}
                iClassName={"bi-feather"}
                url={"/myposts"}
              />
            </Col>
            <Col>
              <MyMenuCard
                name={"내가 쓴 댓글"}
                text={comments.length + " 건"}
                iClassName={"bi-chat-left-dots"}
                url={"/mycomments"}
              />
            </Col>
          </Row>
        </Container>
      </Stack>
    </>
  );
}

function MyMenuCard({ name, text, iClassName, url }) {
  const navigate = useNavigate();

  function onButtonClick() {
    navigate(url);
  }

  return (
    <>
      <Card>
        <Button
          className="btn-mypage-card"
          style={{ textAlign: "left" }}
          onClick={onButtonClick}
        >
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
            <span className="px-4 filter-category">{text}</span>
          </CardBody>
        </Button>
      </Card>
    </>
  );
}
