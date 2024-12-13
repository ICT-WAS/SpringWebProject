import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function PostingButton() {
  const [showModal, setShowModal] = useState(false);

  // 로그인 모달 닫기 함수
  const handleCloseModal = () => setShowModal(false);

  // 로그인 모달 열기 함수
  const handleShowModal = () => setShowModal(true);

  // 버튼 클릭 시 실행되는 함수
  const handleButtonClick = () => {
    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    if (userId === null) {
      handleShowModal(); // 로그인 필요 시 모달 표시
    } else {
      window.location.href = '/community/posting'; // 로그인 되어 있으면 해당 페이지로 리다이렉트
    }
  };

  return (
    <>
      <Button
        style={{ whiteSpace: 'nowrap' }}
        variant="dark"
        onClick={handleButtonClick}
      >
        게시글 등록
      </Button>

      {/* 로그인 모달 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>로그인 필요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          로그인 후 게시글을 등록할 수 있습니다. 로그인 하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              // 로그인 페이지로 리다이렉트 (예시: /login 경로)
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

// 예시: 토큰에서 userId를 추출하는 함수
function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // JWT 토큰을 디코딩
    return decodedToken.userId || null;
  } catch (error) {
    return null;
  }
}

export default PostingButton;
