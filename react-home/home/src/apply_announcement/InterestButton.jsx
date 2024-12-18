import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "../api/TokenUtils";

export default function InterestButton({ houseId }) {
  const [interestId, setInterestId] = useState(null); // 관심 여부 상태
  const token = localStorage.getItem("accessToken");
  const userId = getUserIdFromToken(token);

  const [showModal, setShowModal] = useState(false);

  // 로그인 모달 닫기 함수
  const handleCloseModal = () => setShowModal(false);

  // 로그인 모달 열기 함수
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    // userId와 houseId를 API로 보내어 관심 여부 확인

  
    const checkInterest = async () => {
      if(userId === null){
        return;
      }
      try {
        // GET 요청을 통해 관심 여부 확인
        const response = await axios.get(
          `http://localhost:8989/interest/check/${userId}/${houseId}`
        );
        setInterestId(response.data); // 응답 받은 값을 상태에 저장
        console.log(response);
      } catch (error) {
        console.error("관심 여부 조회 실패", error);
      }
    };

    checkInterest(); // 컴포넌트가 마운트될 때 API 호출
  }, [userId, houseId]); // userId와 houseId가 변경될 때마다 호출

  const handleRegisterInterest = async () => {
    try {
      // POST 요청을 통해 관심 등록

      if (userId === null) {
        handleShowModal(); // 로그인 필요 시 모달 표시
       return; 
      }

      const response = await axios.post(
        "http://localhost:8989/interest", 
        { userId, houseId }
      );
      
      if (response.data) {
        // 성공적으로 관심 등록이 되면 interestId 상태 업데이트
        setInterestId(response.data);
        alert("관심 공고에 등록되었습니다.")
      } else {
        // null이 반환되면 알림 표시
        alert("관심 공고 등록에 실패하였습니다");
      }
    } catch (error) {
      console.error("관심 공고 등록 실패", error);
    }
  };

  const handleDeleteInterest = async () => {

    if (userId === null) {
      handleShowModal(); // 로그인 필요 시 모달 표시
      return;
    }
    try {
      
      const response = await axios.delete(
        `http://localhost:8989/interest/${interestId}` 
      );
      
      if (response.data) {
        
        setInterestId(null);
        alert("관심 공고가 삭제되었습니다.")
      } else {
        
        alert("관심 공고 삭제를 실패하였습니다");
      }
    } catch (error) {
      console.error("관심 공고 삭제 실패", error);
    }
  };


  return (
    <>
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
      {interestId ? (
        // 관심이 이미 등록된 경우
        <Button style={{ whiteSpace: 'nowrap' }} variant="dark" onClick={handleDeleteInterest}>
          <i className="bi-bookmark" />
        </Button>
      ) : (
        // 관심이 등록되지 않은 경우
        <Button style={{ whiteSpace: 'nowrap' }} variant="secondary" onClick={handleRegisterInterest}>
          <i className="bi-bookmark" />
        </Button>
      )}
    </>
  );
}