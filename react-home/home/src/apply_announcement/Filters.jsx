import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import FilteredTag from "./FilteredTag";
import React from "react";

/* 선택된 태그 목록*/
export default function Filters({ selectedFilter, handleClose, handleFilterButtonClick }) {

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
                    0,000 건의 공고 보기
                </Button>
            </Stack>
        </>
    );
}
