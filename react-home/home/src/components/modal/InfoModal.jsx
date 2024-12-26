import React from "react";
import "./Modal.css";

const InfoModal = ({ title, message, onClose }) => {
  // Enter 키 입력 시 확인 버튼 클릭 이벤트 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClose(); // 확인 버튼 클릭 시 실행할 함수 호출
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>알림</h2>
        </div>
        <div className="modal-body">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onKeyDown={handleKeyDown} onClick={onClose} tabIndex="0">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
