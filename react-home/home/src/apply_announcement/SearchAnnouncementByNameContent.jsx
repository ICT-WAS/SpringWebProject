import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import SubscriptionCardsWithHeader from "./SubscriptionCards";
import PaginationItem from "./PaginationItem";

export default function SearchAnnouncementByNameContent() {
    const { keyword } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [subscriptions, setSubscriptions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const pageSize = 10; 
    
    // 최초 렌더링
    useEffect(() => {
        onPageChanged(1);
        resetPage();
        fetchAnnouncement(1); 
    }, [keyword]);

    // 데이터 요청 함수
    const fetchAnnouncement = (page) => {
        setLoading(true);
        axios
            .get("http://localhost:8989/house/keyword", {
                params: {
                    keyword: keyword,
                    page: page - 1,
                    size: pageSize,
                },
            })
            .then((response) => {
                setSubscriptions(response.data.houseInfoList); // 게시글 목록
                setTotalCount(response.data.totalCount); // 총 게시글 수
                setLoading(false);
                })
                .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
                });
    };

    // 페이지 변경
    function onPageChanged(page) {
        setCurrentPage(page);
        fetchAnnouncement(page);
    }
    const paginationRef = useRef();
    
    function resetPage() {
        paginationRef.current.resetPage();
    }

    return (
        <>
          <Container>
            <Row>
              <SubscriptionCardsWithHeader subscriptions={subscriptions} totalCount={totalCount} loading={loading} />
            </Row>
            <Row>
              <PaginationItem ref={paginationRef} onPageChanged={onPageChanged} totalCount={totalCount} pageSize={pageSize} />
            </Row>
          </Container>
        </>
      );
    }