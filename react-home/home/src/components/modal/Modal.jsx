import React, { useEffect, useRef } from "react";
import "./Modal.css";

const Modal = React.forwardRef((props, ref) => {
  // 모달 열릴 때 확인 버튼에 자동으로 포커스 설정
  const { title, message, onClose } = props;
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

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
          <button
            ref={ref}
            onKeyDown={handleKeyDown}
            onClick={onClose}
            tabIndex="0"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
});

export default Modal;
