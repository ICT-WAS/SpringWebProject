import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Stack } from "react-bootstrap";
import { getUserIdFromToken } from '../api/TokenUtils';
import { useNavigate } from "react-router-dom";

export default function MyPageContent() {

    const navigate = useNavigate();

    function onConditionButtonClick() {
        navigate("/conditions");
    }

    return (
        <>
            <p className='heading-text'>
                마이페이지
            </p>
            <Stack direction='vertical' gap={5} >
                <Card body>
                    <p className='filter-values'>내 조건</p>
                    <hr />
                    <ConditionButton onClick={onConditionButtonClick} />
                    <hr />
                    <p className='filter-values'>내 정보</p>
                    <hr />
                    <ConditionButton />
                </Card>

                <p className='heading-text'>
                    모아보기
                </p>
                <Container fluid>
                    <Row>
                        <Col >
                            <MyMenuCard name={"찜한 공고"} total={21} iClassName={"bi-suit-heart"} />
                        </Col>
                        <Col >
                            <MyMenuCard name={"내가 쓴 글"} total={1} iClassName={"bi-feather"} />
                        </Col>
                        <Col >
                            <MyMenuCard name={"내가 쓴 댓글"} total={3} iClassName={"bi-chat-left-dots"} />
                        </Col>
                    </Row>
                </Container>
            </Stack>
        </>
    );
}

function MyMenuCard({ name, total, iClassName }) {
    return (
        <>
            <Card>
                <Button className="btn-mypage-card" style={{ textAlign: 'left' }}>
                    <CardBody >
                        <p className='heading-text'>
                            {name}<br />
                        </p>
                        <b>
                            <i className={`bi ${iClassName}`} style={{ fontSize: '2.5rem' }} />
                        </b>
                        <span className="px-4 ">{total}건</span>
                    </CardBody>

                </Button>
            </Card>
        </>
    );
}

function ConditionButton({ onClick }) {

    const [hasCondition, setHasCondition] = useState(false);

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const fetchCondition = () => {
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                setHasCondition(response.data.hasCondition);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    };

    useEffect(() => {
        fetchCondition();
    }, []);

    return (
        <>
            <Button variant='dark' onClick={onClick} >{hasCondition ? "조건 확인" : "조건 등록"}</Button>

        </>
    );
}