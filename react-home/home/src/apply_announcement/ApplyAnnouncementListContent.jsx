import axios from 'axios';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import SubscriptionCardsWithHeader from './SubscriptionCards.jsx'
import PaginationItem from './PaginationItem.jsx';
import Filters from './Filters.jsx';
import Conditions from './Conditions.jsx';
import { convertFiltersToQuery, convertFiltersToUrl } from '../common/utils.js';
import { getUserIdFromToken } from '../api/TokenUtils.js';


export default function ApplyAnnouncementListContent() {
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [subscriptions, setSubscriptions] = useState([]);  // 공고 리스트 상태
  const [totalCount, setTotalCount] = useState(0);  // 전체 데이터 개수

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;  // 한 페이지에 표시할 항목 수

  const token = localStorage.getItem("accessToken");
  const userId = getUserIdFromToken(token);

  // 내 조건으로 검색
  const [checked, setChecked] = useState(false);

  // {category: '주택정보', subcategories: [{category: '주택분류', values: [{value: '민영주택'}]}]}

  /* 필터 적용시 */
  function onClickedFilter({ category, subcategoryName, value, submitData }) {

    const updateFilters = (prevFilters, category, subcategoryName, value, submitData) => {
      let handledUpdate = false;

      // 카테고리 및 서브카테고리를 업데이트하는 함수
      const updateSubcategories = (subcategories) => {
        return subcategories.map((sub) => {
          if (sub.category !== subcategoryName) {
            return sub;
          }

          handledUpdate = true;

          const valueExists = sub.values.some((v) => v.value === value);
          if (valueExists) {
            return sub;
          }

          const shouldClearSubCategory =
            (category === '희망지역' && (value.endsWith('전체') || sub.values.some((v) => v.value.endsWith('전체')))) ||
            subcategoryName === '공급금액';

          if (shouldClearSubCategory) {
            return { ...sub, values: [{ value, submitData }] };
          }

          return { ...sub, values: [...sub.values, { value, submitData }] };
        });
      };

      // 필터 업데이트 로직
      const updatedFilters = prevFilters.map((filter) => {
        if (filter.category !== category) {
          return filter;
        }

        const updatedSubcategories = updateSubcategories(filter.subcategories);

        if (!handledUpdate) {
          updatedSubcategories.push({ category: subcategoryName, values: [{ value, submitData }] });
          handledUpdate = true;
        }

        return { ...filter, subcategories: updatedSubcategories };
      });

      // 새로운 카테고리 추가
      if (!handledUpdate) {
        updatedFilters.push({
          category,
          subcategories: [{ category: subcategoryName, values: [{ value, submitData }] }],
        });
      }

      return updatedFilters;
    };

    setSelectedFilter((prevFilters) => updateFilters(prevFilters, category, subcategoryName, value, submitData));
  }


  /* 필터 삭제시 */
  function handleClose(filterName) {
    setSelectedFilter((prevFilters) =>
      prevFilters.map(filter => ({
        ...filter, subcategories:
          filter.subcategories.map(sub => ({
            ...sub, values:
              sub.values.filter(value => value.value !== filterName),
          })),
      }))
        .filter((filter) =>
          filter.subcategories.some((sub) => sub.values.length > 0)
        )
    );
  }

  // 최초 렌더링
  useEffect(() => {

    fetchData(null, currentPage);
  }, [currentPage]);

  // 페이지 변경
  function onPageChanged(page, filter = selectedFilter) {
    setCurrentPage(page);

    const filters = convertFiltersToQuery(filter);
    const queryParams = convertFiltersToUrl(filters);
    fetchData(queryParams, page);
  }

  const fetchData = (queryParams, page) => {
    let finalQueryParams = queryParams;
    if(checked) {
      finalQueryParams = {...queryParams, userId: userId};
    }

    setLoading(true);
    axios
      .get("http://localhost:8989/house", {
        params: {
          ...finalQueryParams,
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
  }

  // 필터 검색 버튼
  function handleFilterButtonClick() {
    resetPage(selectedFilter);
  }

  // 필터 초기화 버튼
  function onFilterClearClick() {
    setSelectedFilter([]);
    resetPage([]);
  }

  const paginationRef = useRef();

  function resetPage(filter) {
    paginationRef.current.resetPage(filter);
  }

  const [showModal, setShowModal] = useState(false);

  // 로그인 모달 닫기 함수
  const handleCloseModal = () => setShowModal(false);

  // 로그인 모달 열기 함수
  const handleShowModal = () => setShowModal(true);


  // 내 조건으로 검색
  function handleChangeCheck(checked) {

    if(userId === null) {
      handleShowModal();
      return;
    }

    setChecked(checked);
  }

  return (
    <>
    {/* 로그인 모달 */}
    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>로그인 필요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          해당 기능은 로그인 후 이용할 수 있습니다. 로그인 하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              // 로그인 페이지로 리다이렉트
              window.location.href = '/login';
            }}
          >
            로그인 하러 가기
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      <Container>
        <Row className="mb-2">
          <Conditions onClickedFilter={onClickedFilter} onChangeCheck={handleChangeCheck} value={checked} />
        </Row>
        <Row >
          <Col>
          </Col>
          <Col style={{textAlign: 'right'}}>
            <Button onClick={onFilterClearClick}
            variant='link' className="link-body-emphasis link-underline link-underline-opacity-0">
            <p className="nav-bar-links" style={{ textAlign: 'right' }}>
              <b><i className="bi bi-arrow-clockwise" />초기화</b>
            </p>
          </Button>
          </Col>
        </Row>
        <Row className="mb-5">
          <Filters selectedFilter={selectedFilter} handleClose={handleClose} handleFilterButtonClick={handleFilterButtonClick} />
        </Row>

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
