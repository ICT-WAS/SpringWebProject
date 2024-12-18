import axios from "axios";
import { Toast } from "react-bootstrap";

function Notification({ notification, onDeleteNotification }) {

    let typeText;
    let url;

    switch (notification.type) {
        case "ABOUT_POST":
            typeText = "게시글 알림";
            url = `/community/${notification.post.postId}`
            break;
        case "ABOUT_COMMENT":
            typeText = "댓글 알림";
            url = `/community/${notification.post.postId}`
            break;
        case "ABOUT_ANNOUNCEMENT":
            typeText = "공고 알림";
            url = `/subscriptions/info/${notification.house.houseId}`
            break;
        default:
            typeText = "알림";
            url = '/';
            break;
    }

    // 시간 계산 함수
    const getTimeAgo = (createdAt) => {
        const currentTime = new Date();
        const createdTime = new Date(createdAt);
        const timeDiff = currentTime - createdTime;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        if (seconds < 60) {
            return '조금 전'; // 1분 미만
        } else if (minutes < 60) {
            return `${minutes}분 전`; // 1시간 미만
        } else if (hours < 24) {
            return `${hours}시간 전`; // 시간 단위
        } else if (days < 30) {
            return `${days}일 전`; // 일 단위
        } else {
            return '오래 전'; // 달 단위
        }
    };

    function handleCheckClick() {
        axios
            .patch(`http://localhost:8989/notification/${notification.notificationId}`
            )
            .then((response) => {

            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    }

    function onClose(){
        axios
            .delete(`http://localhost:8989/notification/${notification.notificationId}`

            )
            .then((res) => {
                onDeleteNotification(notification.notificationId);
            })
            .catch((err) => {
                console.error("데이터 요청 실패:", err);
            });
    }

    const toastStyle = notification.isChecked ? { backgroundColor: "rgba(212, 212, 212, 0.7)" } : {};

    return (
        <>
            <Toast 
                style={{ marginBottom: '20px', ...toastStyle }} 
                position={'top-start'}
                onClose={onClose}  // onClose 메서드를 Toast에 연결
            >
                <Toast.Header>
                    <strong className="me-auto">
                        <a href={url} onClick={handleCheckClick} style={{ color: 'brown' }}>
                            {typeText}
                        </a>
                        {notification.isChecked ? (
                            ' (읽음)'
                        ) : (
                            ' (신규)'
                        )}
                    </strong>
                    <small>{getTimeAgo(notification.createdAt)}</small>
                </Toast.Header>
                <Toast.Body>{notification.message}</Toast.Body>
            </Toast>
        </>
    );
}

export default Notification;