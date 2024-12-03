import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Container, Row, Col, Button, Stack } from 'react-bootstrap';

function Logo() {
  return (
    <>
      <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
        <Stack direction="horizontal" gap={3}>
          <p><i className="bi bi-house-door" /></p>
          <p className='heading-text'>내집마련</p>
        </Stack>
      </a>
    </>
  );
}

function SearchField() {
  return (
    <>
      <div className='div-search'>
        <Stack fluid direction="horizontal" gap={1}>
          <div className='me-auto'>
            <input type='text' className='text-search' placeholder='공고 제목으로 검색' />
          </div>
          <div>
            <button className='btn btn-search' >
              <i className="bi bi-search" />
            </button>
          </div>
        </Stack>
      </div>
    </>
  );
}

function NavBar() {
  return (
    <>
      <Stack direction="horizontal" gap={3} className='justify-content-end'>
        <p className="nav-bar-links">
          <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
            청약 공고
          </a>
        </p>
        <p className="nav-bar-links">
          <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
            커뮤니티
          </a>
        </p>
        <p className="nav-bar-links">
          <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
            조건 등록
          </a>
        </p>
        <p className="nav-bar-links">
          <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
            Q&amp;A
          </a>
        </p>
        <p className="nav-bar-links">
          <Button variant="light" style={{fontSize:'14px'}}>
            로그인
          </Button>
        </p>
        <p className="nav-bar-links">
          <Button variant="dark" style={{fontSize:'14px'}}>
            회원가입
          </Button>
        </p>
      </Stack>

    </>
  );
}

export default function Header() {
  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col sm={2}>
            <Logo />
          </Col>
          <Col sm={4}>
            <SearchField />
          </Col>
          <Col sm={6}>
            <NavBar />
          </Col>
        </Row>
      </Container>
    </>
  );
}