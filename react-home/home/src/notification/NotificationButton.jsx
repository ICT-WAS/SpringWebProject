import axios from "axios";
import { Badge, Button, Offcanvas, Toast } from "react-bootstrap";
import { getUserIdFromToken } from "../api/TokenUtils";
import { useEffect, useState } from "react";
import Notification from "./Notification";

function NotificationButton() {

    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    // 알림 사이드 바 열기
    const handleShowNotification = () => setShowNotification(true);

    // 알림 사이드 바 닫기
    const handleCloseNotification = () => setShowNotification(false);

    function handleNotificationClick() {
        fetchData(userId);
        handleShowNotification(); // 알림 모달 열기
    }

    const fetchData = (userId) => {
        if (userId === null) {
            return;
        }

        axios
            .get(`http://localhost:8989/notification/list/${userId}`
            )
            .then((response) => {
                setNotifications(response.data);
                setNotificationCount(response.data.filter(notification => notification.isChecked === false).length);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    }

    useEffect(() => {
        fetchData(userId);
    }, [userId]);

     // 자식으로부터 알림 삭제 요청을 받으면 해당 알림 삭제
     const handleDeleteNotification = (notificationId) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.notificationId !== notificationId)
        );
    };


    return (
        <>
            <Button
                variant="link"
                onClick={handleNotificationClick}
                className="link-body-emphasis link-underline link-underline-opacity-0"
            >
                <p>
                    <a
                        href="#"
                        className="link-body-emphasis link-underline link-underline-opacity-0"
                    >
                        <i className="bi bi-bell" />
                        
                        {notificationCount > 0 && 
                        <Badge pill bg="danger">{notificationCount}</Badge>
                        }
                    </a>
                </p>
            </Button>
            {/* 알림 사이드 바 (Offcanvas) */}
            <Offcanvas
                show={showNotification}
                onHide={handleCloseNotification}
                placement="end" // 오른쪽에서 나타나게 설정
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><p className="heading-text">알림</p></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {userId === null ? (
                        <Toast style={{ marginBottom: '20px' }} position={'top-start'}>
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">
                                    <a href='/login' style={{ color: 'brown' }}>
                                        로그인 필요
                                    </a>
                                </strong>
                                <small></small>
                            </Toast.Header>
                            <Toast.Body>알림 기능은 로그인 후에 이용 가능합니다.</Toast.Body>
                        </Toast>
                    ) : (
                        ''
                    )}

                    {notifications.length < 1 ? (
                        <Toast style={{ marginBottom: '20px' }} position={'top-start'}>
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">
                                    알림 없음
                                </strong>
                                <small></small>
                            </Toast.Header>
                            <Toast.Body>알림이 없습니다.</Toast.Body>
                        </Toast>
                    ) : (
                        notifications.map((notification) => (
                            <Notification
                                key={notification.notificationId}
                                notification={notification}
                                onDeleteNotification={handleDeleteNotification}
                            />
                        ))
                    )}

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}


export default NotificationButton;