import { Button, Col, Container, Form, InputGroup, Row, Pagination, Stack } from "react-bootstrap";
import CommunityCard from "./CommunityCard";
import axios from "axios";
import { useEffect, useState } from "react";
import PostingButton from "./PostingButton";

export default function CommunityPostListContent() {
    const [posts, setPosts] = useState([]); // 게시글 목록 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [keyword, setKeyword] = useState(""); // 검색어 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalCount, setTotalCount] = useState(0); // 총 게시글 수 상태

    const pageSize = 10; // 한 페이지당 게시글 수

    // 데이터 요청 함수
    const fetchPosts = (pageNumber1) => {
        setLoading(true);
        axios
            .get("http://localhost:8989/community", {
                params: {
                    keyword,
                    page: pageNumber1 || currentPage, // pageNumber1이 있으면 pageNumber1, 없으면 currentPage 사용
                    size: pageSize,
                },
            })
            .then((response) => {
                setPosts(response.data.content); // 게시글 목록
                setTotalCount(response.data.totalCount); // 총 게시글 수
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    };

    // 검색 버튼 클릭 시 API 요청
    const handleSearch = () => {
        setCurrentPage(1); // 검색 시 첫 페이지로 리셋
        fetchPosts(1); // 검색어로 API 호출
    };

    // 페이지 변경 시 처리
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 번호 업데이트
        fetchPosts(); // 페이지가 변경될 때마다 API 호출
    };

    // 페이지네이션 계산
    const totalPages = Math.ceil(totalCount / pageSize); // 전체 페이지 수 계산
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => handlePageChange(i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    // 초기 데이터 로딩
    useEffect(() => {
        fetchPosts(); // 처음 렌더링 시 모든 게시글 로드
    }, [currentPage]); // currentPage가 변경될 때마다 API 호출

    return (
        <>
            <Container className="px-5" fluid="md">
                <p className='heading-text '>
                    커뮤니티
                </p>
                <div className="mb-5"></div>
                {/* 검색 입력 필드와 버튼 */}
                <Row className="mb-4">
                    <Col md={8}>
                        <InputGroup>
                            <Form.Control
                                placeholder="제목으로 검색"
                                aria-label="Search"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)} // 검색어 상태 변경
                            />
                            <Button variant="light" onClick={handleSearch}>
                                <i className="bi bi-search" />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col md={4} className="text-end">
                        <PostingButton />
                    </Col>
                </Row>

                <div className='heading-text'>
                    게시글 목록
                    <div className='card-body-text mb-0'>{totalCount} 건</div>
                </div>
                <br />



                {/* 로딩 중 표시 */}
                {loading ? (
                    <p>로딩 중...</p>
                ) : (
                    <Stack direction='vertical' gap={3}>
                        {totalCount === 0 ? (
                            <p>해당 키워드가 포함된 게시글이 없습니다.</p>
                        ) : (
                            posts.map((post) => (
                                <div key={post.postId}>
                                    <CommunityCard post={post} />
                                </div>
                            ))
                        )}
                    </Stack>
                )}

                {/* 페이지네이션 */}
                <div className="d-flex justify-content-center mt-3">
                    <Pagination className="custom-pagination">
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {paginationItems}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            </Container>
        </>
    );
}
