import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Container, Row, Col, Button, Card, CardBody, Modal } from "react-bootstrap";
import LoginStateButton from "../components/login/LoginStateButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUserIdFromToken } from "../api/TokenUtils";

function Logo() {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/");
  }

  return (
    <>
      <Button variant="link"
        onClick={handleLogoClick}
        className="link-body-emphasis link-underline link-underline-opacity-0"
      >
        <Container>
          <Row>
            <Col>
              <p>
                <i className="bi bi-house-door" />
              </p>
            </Col>
            <Col md="auto">
              <p className="heading-text">청약이지</p>
            </Col>
          </Row>
        </Container>
      </Button>
    </>
  );
}

function SearchField() {
  const [keyword, setKeyword] = useState('');  
  const navigate = useNavigate(); 

  const handleSearch = () => {
    if (keyword) {
      navigate(`/subscriptions/search/${keyword}`);  
    }
  };

  return (
    <>
      <InputGroup>
        <Form.Control 
        placeholder="공고 제목으로 검색" 
        aria-label="Search" 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        />
        <Button variant="light" onClick={handleSearch}>
          <i className="bi bi-search" />
        </Button>
      </InputGroup>
    </>
  );
}

function NavBar() {
  const [showModal, setShowModal] = useState(false);

  // 로그인 모달 닫기 함수
  const handleCloseModal = () => setShowModal(false);

  // 로그인 모달 열기 함수
  const handleShowModal = () => setShowModal(true);
  const token = localStorage.getItem("accessToken");
  const userId = getUserIdFromToken(token);

  const navigate = useNavigate();

  function handleListClick() {
    navigate("/subscriptions");
  }

  function handleConditionsClick() {
    navigate("/conditions");
  }

  function handlePostListClick() {
    navigate("/community");
  }

  function handleMyPageClick() {
    if (userId === null) {
      handleShowModal(); // 로그인 필요 시 모달 표시
    } else {
      navigate("/mypage");
    }
  }

  function handleInterestListClick(){
    if (userId === null) {
      handleShowModal(); // 로그인 필요 시 모달 표시
    } else {
      navigate("/interest");
    }
  }
  
  

  return (
    <>
      <Container>
        <Row className="align-items-center">
          <Col md="auto">
            <Button variant="link" onClick={handleListClick}
              className="link-body-emphasis link-underline link-underline-opacity-0"
            >
              <p className="nav-bar-links">
                청약 공고
              </p>
            </Button>
          </Col>

          <Col md="auto">
            <Button variant="link" onClick={handlePostListClick}
              className="link-body-emphasis link-underline link-underline-opacity-0"
            >
              <p className="nav-bar-links">
                커뮤니티
              </p>
            </Button>
          </Col>

          <Col md="auto">
            <Button variant="link" onClick={handleConditionsClick}
              className="link-body-emphasis link-underline link-underline-opacity-0"
            >
              <p className="nav-bar-links">
                조건 등록
              </p>
            </Button>
          </Col>

          <Col md="auto">
          <Button variant="link" onClick={handleInterestListClick}
              className="link-body-emphasis link-underline link-underline-opacity-0"
            >
              <p className="nav-bar-links">
                관심 공고
              </p>
            </Button>
          </Col>

          <Col md="auto">
            <Button variant="link" onClick={handleMyPageClick}
              className="link-body-emphasis link-underline link-underline-opacity-0"
            >
              <p>
                <a
                  href="#"
                  className="link-body-emphasis link-underline link-underline-opacity-0"
                >
                  <i className="bi bi-bell" />
                </a>
              </p>
            </Button>
          </Col>

          <LoginStateButton />
        </Row>
      </Container>
      {/* 로그인 모달 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>로그인 필요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          해당 기능은 로그인 후 이용할 수 있습니다. 로그인 하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              // 로그인 페이지로 리다이렉트
              window.location.href = '/login';
            }}
          >
            로그인 하러 가기
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default function Header() {
  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Logo />
          </Col>
          <Col>
            <SearchField />
          </Col>
          <Col md="auto">
            <NavBar />
          </Col>
        </Row>
      </Container>
    </>
  );
}
