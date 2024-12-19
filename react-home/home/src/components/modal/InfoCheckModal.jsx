import { useState } from "react";
import "./Modal.css";

const InfoCheckModal = ({
  title,
  onClickSubmit,
  infoFirst,
  infoSecond,
  onClose,
}) => {
  //체크박스 체크 상태 확인
  const [isChecked, setIsChecked] = useState(false);

  //체크박스 체크
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-body">
          <h3>{title}</h3>
          <div className="information">
            <div className="info-item">
              <p className="info-number">1.</p>
              <div className="info-text">{infoFirst}</div>
            </div>
          </div>
          <div className="info-item">
            <p className="info-number">2.</p>
            <div className="info-text">{infoSecond}</div>
          </div>
        </div>
        <div className="agreement">
          <label>
            <input type="checkbox" onChange={handleCheckboxChange} />
            안내 사항을 모두 확인했으며 이에 동의합니다.
          </label>
        </div>
        <div className="modal-footer-two-button">
          <button
            className="confirm-button"
            onClick={onClickSubmit}
            tabIndex="0"
            disabled={!isChecked}
          >
            확인
          </button>
          <button className="cancel-button" onClick={onClose} tabIndex="0">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCheckModal;
