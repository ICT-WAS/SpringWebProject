import axios from 'axios';
import { Button, Col, Container, Placeholder, Row, Spinner, Stack } from "react-bootstrap";
import FilteredTag from "./FilteredTag";
import React, { useState, useEffect } from 'react';
import { convertFiltersToQuery, convertFiltersToUrl } from '../common/utils';

/* 선택된 태그 목록*/
export default function Filters({ selectedFilter, handleClose, handleFilterButtonClick }) {

    const [currentFilterTotalCount, setCurrentFilterTotalCount] = useState(0);  // 필터를 누를 때마다 바뀌는 전체 데이터 개수
    const [currentFilterTotalloading, setCurrentFilterTotalLoading] = useState(false);  // 로딩 상태

    const getTotalData = () => {
        const filters = convertFiltersToQuery(selectedFilter);
        const queryParams = convertFiltersToUrl(filters);
        setCurrentFilterTotalLoading(true);
        axios
            .get("http://localhost:8989/house", {
                params: {
                    ...queryParams,
                    page: 1,
                    size: 1,
                },
            })
            .then((response) => {
                setCurrentFilterTotalCount(response.data.totalCount); // 총 게시글 수
                setCurrentFilterTotalLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setCurrentFilterTotalLoading(false);
            });
    }

    useEffect(() => {
        getTotalData();
    }, [selectedFilter]);


    const filters = selectedFilter.map((filter) => {
        const subcategories = filter.subcategories;

        const subcategoriesTag = subcategories.map((sub, subIndex) => {
            return sub.values.map((value, valueIndex) =>
                <FilteredTag key={subIndex + '-' + valueIndex} filterName={value.value} handleClose={handleClose} />
            );
        })

        return (
            <React.Fragment key={filter.category}>
                <Row>
                    <Col>
                        <p className='filter-category mb-2'>
                            {filter.category}
                        </p>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Stack direction="horizontal" gap={2} style={{ flexWrap: 'wrap' }}>
                            {subcategoriesTag}
                        </Stack>
                    </Col>
                </Row>
            </React.Fragment>
        );
    });

    return (
        <>
            <Stack direction='horizontal' gap={2} style={{ alignItems: 'flex-end' }}>
                <Container>
                    {filters}
                </Container>
                <Button variant='dark' style={{ whiteSpace: 'nowrap' }} onClick={handleFilterButtonClick}>
                    {currentFilterTotalloading
                        ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        : <span>{currentFilterTotalCount}</span>
                    }
                    건의 공고 보기
                </Button>
            </Stack>
        </>
    );
}
