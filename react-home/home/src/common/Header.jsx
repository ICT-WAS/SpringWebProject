import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Container, Row, Col, Button, Card, CardBody } from "react-bootstrap";
import LoginStateButton from "../components/login/LoginStateButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
              <p className="heading-text">내집마련</p>
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
    navigate("/mypage");
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
            <p className="nav-bar-links">
              <a
                href="#"
                className="link-body-emphasis link-underline link-underline-opacity-0"
              >
                Q&amp;A
              </a>
            </p>
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
