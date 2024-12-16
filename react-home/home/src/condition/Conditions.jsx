import axios from 'axios';
import { Button, Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useState, useEffect } from "react";
import { getUserIdFromToken } from "../api/TokenUtils";

export default function Conditions() {

    const [loading, setLoading] = useState(false);
    const [condition, setCondition] = useState(null);


    const navigate = useNavigate();

    function handleClick(e) {
        navigate("/condition-1");
    }

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const fetchCondition = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                setCondition(response.data.condition);
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCondition();
    }, []);

    return (
        <>
            <Container className="p-5" fluid="md">
                <Stack direction="vertical" gap={5}>
                    <Header />

                    {condition === null && 
                    <></>
                    }

                    <p className='heading-text'>등록된 조건이 없습니다.</p>
                    <Button variant="dark" onClick={handleClick}>조건 등록</Button>

                    <Footer />
                </Stack>
            </Container>
        </>
    );
}

