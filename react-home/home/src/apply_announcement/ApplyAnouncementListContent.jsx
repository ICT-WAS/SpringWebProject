import axios from 'axios';
import { Container, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { conditionSubCategory } from './conditionInfo.js';
import PaginationItem from './PaginationItem';
import SubscriptionCards from './SubscriptionCards';
import Filters from './Filters';
import Conditions from './Conditions.jsx';

// filters를 쿼리 파라미터로 변환하는 함수
function convertFiltersToQuery(selectedFilter) {
  let param = {};

  selectedFilter.map((filter) => {

    const subcategories = filter.subcategories;

    subcategories.map((sub) => {
      sub.values.map((value) => {
        if (filter.category === '희망지역') {
          param['regions'] = [
            ...(param['regions'] || []),
            value.submitData ? value.submitData : value.value
          ];
        } else if (sub.category === '공급금액') {
          param[conditionSubCategory[sub.category]] = [
            ...(param[conditionSubCategory[sub.category]] || []),
            ...value.submitData.slice(0, 2)
          ];
        } else {
          param[conditionSubCategory[sub.category]] = [
            ...(param[conditionSubCategory[sub.category]] || []),
            value.submitData
          ];
        }
      });
    });
  });

  return param;
}

function convertFiltersToUrl(filters) {
  let queryParams = {};

  Object.keys(filters).forEach(key => {
    // 배열을 콤마(,)로 결합하여 하나의 문자열로 변환
    queryParams[key] = filters[key].join(',');
  });

  return queryParams;
}

export default function MainContent() {
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [loading, setLoading] = useState(true);  // 로딩 상태

  const [subscriptions, setSubscriptions] = useState([]);  // 공고 리스트 상태
  const [totalCount, setTotalCount] = useState(0);  // 전체 데이터 개수
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;  // 한 페이지에 표시할 항목 수

  function onPageChanged(page) {
    setCurrentPage(page);
  }

  // API 호출을 위한 useEffect
  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      // try {
      const response = await axios.get('http://localhost:8989/house', {
        params: {
          page: currentPage - 1,  // 서버에서는 0부터 시작하므로 1을 빼서 전달
          size: pageSize,
        },
      });
      setSubscriptions(response.data.houseInfoList);  // 데이터를 상태에 저장
      setTotalCount(response.data.totalCount);
    };

    fetchData();  // 컴포넌트가 마운트되면 데이터 가져오기
  }, [currentPage]);


  // {category: '주택정보', subcategories: [{category: '주택분류', values: [{value: '민영주택'}]}]}

  /* 필터 적용시 */
  function onClickedFilter({ category, subcategoryName, value, submitData }) {

    setSelectedFilter((prevFilters) => {
      let handledUpdate = false;

      const updatedFilters = prevFilters.map((filter) => {
        if (filter.category !== category) {
          return filter;
        }

        // 중복x => 값 추가
        let updatedSubcategories = filter.subcategories.map((sub) => {
          if (sub.category !== subcategoryName) {
            return sub;
          }

          handledUpdate = true;

          // 중복 여부를 확인하고 값 추가
          const valueExists = sub.values.some((v) => v.value === value);

          if (valueExists) {
            return sub;
          }

          // 공급금액 변경되면 삭제 후 추가
          // '전체'로 끝나는 값을 추가하려는 경우 해당 subcategory 내의 모든 아이템 삭제
          // '전체' 값이 이미 존재하는 경우, 해당 subcategory 내의 모든 아이템 삭제
          let clearSubCategory = false;
          if (category === '희망지역' && subcategoryName === sub.category) {
            if (value.endsWith('전체') || sub.values.some((v) => v.value.endsWith('전체'))) {
              clearSubCategory = true;
            }
          } else if (subcategoryName === '공급금액') {
            clearSubCategory = true;
          }

          if (clearSubCategory) {
            return {
              ...sub, values: [{ value: value, submitData: submitData }]  // 모든 값을 삭제
            };
          }

          // 서브카테고리에 새로운 값을 추가한 객체 반환
          return {
            ...sub,
            values: [...sub.values, { value: value, submitData: submitData }],
          };
        });

        // 존재하는 카테고리에 서브카테고리와 값 추가
        if (!handledUpdate) {
          updatedSubcategories.push({ category: subcategoryName, values: [{ value, submitData }] });
          handledUpdate = true;
        }

        return { ...filter, subcategories: updatedSubcategories };
      })

      // 새로운 카테고리에 새 값 추가
      if (!handledUpdate) {
        return [...prevFilters, { category: category, subcategories: [{ category: subcategoryName, values: [{ value, submitData }] }] }];
      }

      return updatedFilters;
    });

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

  const fetchData = (filters) => {
    setLoading(true);
    setCurrentPage(1);
    axios
      .get("http://localhost:8989/house", {
        params: {
          ...filters,
          page: 1,
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

  function handleFilterButtonClick({ selectedFilter }) {
    const filters = convertFiltersToQuery(selectedFilter);
    const queryParams = convertFiltersToUrl(filters);
    fetchData(queryParams);
  }

  return (
    <>
      <Container>
        <Row className="mb-5">
          <Conditions onClickedFilter={onClickedFilter} />
        </Row>
        <Row className="mb-5">
          <Filters pageSize={pageSize} selectedFilter={selectedFilter} handleClose={handleClose} handleFilterButtonClick={handleFilterButtonClick} />
        </Row>
        {loading && <p>로딩중</p>}
        <Row>
          <SubscriptionCards subscriptions={subscriptions} totalCount={totalCount} />
        </Row>
        <Row>
          <PaginationItem onPageChanged={onPageChanged} totalCount={totalCount} pageSize={pageSize} />
        </Row>
      </Container>
    </>
  );
}
