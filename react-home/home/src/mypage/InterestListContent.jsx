import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import { SubscriptionCards } from '../apply_announcement/SubscriptionCards';
import { useEffect, useState } from 'react';
import Spinners from '../common/Spinners';
import { getUserIdFromToken } from '../api/TokenUtils';
import axios from 'axios';

export default function InterestListContent() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const fetchData = (userId) => {
        setLoading(true);
        axios
            .get(`http://localhost:8989/interest/${userId}`

            )
            .then((response) => {
                setSubscriptions(response.data);
                setLoading(false);
                setTotalCount(response.data.length);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData(userId); // 처음 렌더링 시 모든 게시글 로드
    }, []);

    return (
        <>
            <Container className="px-5" fluid="md">
                <Stack direction='vertical' gap={3}>
                    <p className='heading-text'>
                        관심 공고 목록
                    </p>

                    <p className='card-body-text' >{totalCount || 0} 건</p>
                    {loading && <Spinners />}
                    {subscriptions.length < 1 && <p className='filter-values'>관심 공고가 없습니다.</p>}
                    <SubscriptionCards subscriptions={subscriptions} />
                </Stack>
            </Container>
        </>
    );
}