import { Button, Card, Dropdown, Stack, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import FilteredTag from './FilteredTag';
import Nav from 'react-bootstrap/Nav';
import React, { useState, useEffect } from 'react';
import NotificationButton from './NotificationButton';
import { conditions } from './conditions';




function NewSubscriptionCard({ subscription, index }) {
  return (
    <>
      <Container>
        <Card body>
          <Row>
            <Col>
              <Container >
                <Row>
                  <Col><p className='card-header-text'>
                    <a href={`subscriptions/info/${subscription.houseId}`} className='link-body-emphasis link-underline link-underline-opacity-0' >
                      {subscription.houseNm}
                    </a>
                  </p>
                  </Col>
                </Row>
                <Row>
                  <Col md="auto"><p className='card-body-text'>{subscription.type}</p></Col>
                  <Col md="auto"><p className='card-body-text'>{subscription.region1} &gt; {subscription.region2}</p></Col>
                  <Col><p className='card-body-text'>{subscription.rcritPblancDe}</p></Col>
                </Row>
              </Container>
            </Col>
            <Col md="auto">
              <NotificationButton />
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}

/* 공고 리스트 */
function NewSubscriptionCards() {
  const [subscriptions, setSubscriptions] = useState([]);  // 공고 리스트 상태
  // const [loading, setLoading] = useState(true);  // 로딩 상태
  // const [error, setError] = useState(null);  // 에러 상태
  const [totalCount, setTotalCount] = useState(0);  // 전체 데이터 개수
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const pageSize = 10;  // 한 페이지에 표시할 항목 수

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      // } catch (err) {
      //   setError('데이터를 가져오는 데 실패했습니다.');
      // } finally {
      //   setLoading(false);  // 로딩 끝
      // }
    };

    fetchData();  // 컴포넌트가 마운트되면 데이터 가져오기
  }, [currentPage]);

  // // 로딩 중일 때 표시할 메시지
  // if (loading) {
  //   return <p>로딩 중...</p>;
  // }

  // // 에러가 발생한 경우 표시할 메시지
  // if (error) {
  //   return <p>{error}</p>;
  // }

  const newSubscriptionList = subscriptions.map((subscription, index) =>
    <NewSubscriptionCard  
      key={subscription.title + index}
      subscription={subscription}
      index={index}
   />
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);  // 전체 페이지 수

  // 10개 단위로 페이지 범위 계산
  const rangeStart = Math.floor((currentPage - 1) / 10) * 10 + 1;  // 현재 페이지를 기준으로 시작 페이지
  const rangeEnd = Math.min(rangeStart + 9, totalPages);  // 시작 페이지 + 9 (최대 10개까지 표시)

  // 페이지 아이템 생성
  const paginationItems = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
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

  return (
    <>
      <p className='heading-text'>
        모집공고
      </p>
      <p className='card-body-text mb-0'>{totalCount} 건</p>

      <Stack direction='vertical' gap={3}>
        <Dropdown className="ms-auto px-3">
          <Dropdown.Toggle variant="warning" className='dropdown-transparent' >
            최신순
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">오래된순</Dropdown.Item>
            <Dropdown.Item href="#/action-2">어쩌고</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {newSubscriptionList}
      </Stack>

      {/* Pagination */}
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
    </>
  );
}

// filters를 쿼리 파라미터로 변환하는 함수
function convertFiltersToQuery(filters) {
  const params = new URLSearchParams();

  filters.forEach((filter) => {
    filter.subcategories.forEach((sub) => {
      sub.values.forEach((value) => {
        // 필터의 카테고리, 서브카테고리 이름, 값 을 쿼리 파라미터로 추가
        params.append(`${filter.category}[${sub.category}]`, value.value);
      });
    });
  });

  return params.toString();  // 최종 쿼리 문자열 반환
}

// 필터 버튼 클릭 시 처리하는 함수
function handleFilterButtonClick({selectedFilter}) {

  // filters를 쿼리 파라미터로 변환
  const queryString = convertFiltersToQuery(selectedFilter);

  // axios로 GET 요청 보내기
  axios.get(`http://localhost:8989/house?${queryString}`)
    .then(response => {
      // 서버에서 받은 데이터를 처리 (예: 공고 목록 갱신)
      console.log(response.data);
    })
    .catch(error => {
      // 에러 처리
      console.error("API 요청 실패:", error);
    });
}

/* 선택된 태그 목록*/
function Filters({ selectedFilter, handleClose }) {
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
        <Button variant='dark' style={{ whiteSpace: 'nowrap' }} onClick={() => handleFilterButtonClick({selectedFilter: filters})}>
          0,000 건의 공고 보기
        </Button>
      </Stack>
    </>
  );
}

/* 조건 선택박스 */
function Conditions({ onClickedFilter }) {

  const conditionCards = {
    WishRegion: (props) => <WishRegion {...props} />,
    HomeInfo: (props) => <HomeInfo {...props} />,
    ApplicationPeriod: (props) => <ApplicationPeriod {...props} />,
  };

  const [selectedCondition, setSelectedCondition] = useState(<WishRegion onClickedFilter={onClickedFilter} />);

  const handleSelect = (eventKey) => {
    if (conditionCards[eventKey]) {
      const ResultComponent = conditionCards[eventKey];
      setSelectedCondition(<ResultComponent onClickedFilter={onClickedFilter} />);
    }
  };

  return (
    <>
      <p className='heading-text'>
        조건검색
      </p>

      <Nav justify variant="tabs" defaultActiveKey="WishRegion" onSelect={handleSelect} style={{ paddingRight: 0 }}>
        <Nav.Item>
          <Nav.Link eventKey="WishRegion">희망지역</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="HomeInfo">주택정보</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="ApplicationPeriod">모집기간</Nav.Link>
        </Nav.Item>
      </Nav>
      {selectedCondition}
    </>
  );
}

function SubcategorySection({ subcategoryIndex, category, values, handleClick }) {
  return <>
    <div className='border-div'>
      <p className='filter-category'>
        {category}
      </p>
      <hr className='p-text' />
      <div className="scrollable-table">
        <Table hover borderless>
          <tbody>

            {values.map((item, index) => (
              <tr key={item + index} onClick={handleClick}>
                <td data-subcategory-index={subcategoryIndex} data-index={index} data-value={item.value}>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  </>
}

/* 희망지역 */
function WishRegion({ onClickedFilter }) {

  const categoryName = conditions.wishRegion.category;
  const sidoData = conditions.wishRegion.subcategories;
  const [sidoIndex, setSidoIndex] = useState(0);
  const [gunguData, setGunguData] = useState(sidoData[0].values);


  function handleClickSido(e) {
    const selectedIndex = e.target.getAttribute('data-index');
    setSidoIndex(selectedIndex);
    setGunguData(sidoData[selectedIndex].values);
  }

  function handleClick(e) {
    const selectedValue = e.target.getAttribute('data-value');
    const subcategoryName = sidoData[sidoIndex].category;
    onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue });
  }

  const sidoList = () => {
    return sidoData.map((item, index) => (
      <tr key={item + index} onClick={handleClickSido}>
        <td data-index={index} data-value={item.category}>{item.category}</td>
      </tr>
    ));
  }

  const gunguList = () => {
    return gunguData.map((item, index) => (
      <tr key={item + index} onClick={handleClick}>
        <td data-index={index} data-value={sidoData[sidoIndex].category + '>' + item.value}>{item.value}</td>
      </tr>
    ));
  }

  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
        <div className='border-div'>
          <p className='filter-category'>
            시/도
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                {sidoList()}
              </tbody>

            </Table>
          </div>
        </div>

        <div className='border-div'>
          <p className='filter-category'>
            구/군
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr key={'전체0'} onClick={handleClick}>
                  <td data-index={0} data-value={sidoData[sidoIndex].category}>{'전체'}</td>
                </tr>
                {gunguList()}
              </tbody>
            </Table>
          </div>
        </div>
      </Stack>
    </>
  );
}

/* 주택정보 */
function HomeInfo({ onClickedFilter }) {

  const categoryName = conditions.homeInfo.category;
  const subcategories = conditions.homeInfo.subcategories;

  function handleClick(e) {
    const selectedValue = e.target.getAttribute('data-value');
    const subcategoryIndex = e.target.getAttribute('data-subcategory-index');
    const subcategoryName = subcategories[subcategoryIndex].category;
    onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue });
  }

  const subCategorieSections = () => {
    return subcategories.map((subCategory, index) =>
      <SubcategorySection key={subCategory + index}
        subcategoryIndex = {index}
        category={subCategory.category}
           values={subCategory.values}
          handleClick={handleClick} />
    );
  }

  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
        {subCategorieSections()}
      </Stack>
    </>
  );
}

/* 모집기간 */
function ApplicationPeriod({ onClickedFilter }) {

  const categoryName = conditions.applicationPeriod.category;
  const subcategories = conditions.applicationPeriod.subcategories;

  function handleClick(e) {
    const selectedValue = e.target.getAttribute('data-value');
    const subcategoryIndex = e.target.getAttribute('data-subcategory-index');
    const subcategoryName = subcategories[subcategoryIndex].category;
    onClickedFilter({ category: categoryName, subcategoryId: subcategoryName, value: selectedValue });
  }

  const subCategorieSections = () => {
    return subcategories.map((subCategory, index) =>
      <SubcategorySection key={subCategory + index}
        subcategoryIndex = {index}
        category={subCategory.category}
           values={subCategory.values}
          handleClick={handleClick} />
    );
  }

  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
        {subCategorieSections()}

        <div className='border-div'>
          <p className='filter-category'>
            상세조회
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="warning" className='dropdown-transparent' >
                        공급접수시작일
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">일반공급접수시작일</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">특별공급접수시작일</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    2024-01-01
                  </td>
                  <td>
                    <Button className='btn-transparent'>
                      <i className='bi bi-calendar' />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="warning" className='dropdown-transparent' >
                        공급접수종료일
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">일반공급접수종료일</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">특별공급접수종료일</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    2024-01-01
                  </td>
                  <td>
                    <Button className='btn-transparent'>
                      <i className='bi bi-calendar' />
                    </Button>
                  </td>
                </tr>

              </tbody>

            </Table>
          </div>
        </div>


      </Stack>
    </>
  );
}

export default function MainContent() {
  const [selectedFilter, setSelectedFilter] = useState([]);

  // 카테고리('희망지역') > 서브카테고리('시/도') > 값 ('군/구')
  // 카테고리('주택정보') > 서브카테고리('주택분류') > 값 ('민영주택')
  // {category: '주택정보', subcategories: [{category: '주택분류', values: [{value: '민영주택'}]}]}

  /* 필터 적용시 */
  function onClickedFilter({ category, subcategoryName, value }) {

    
    setSelectedFilter((prevFilters) => {
      let handledUpdate = false;

      const updatedFilters = prevFilters.map((filter) => {
        if (filter.category !== category) {
          return filter;
        }

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

          // 서브카테고리에 새로운 값을 추가한 객체 반환
          return {
            ...sub,
            values: [...sub.values, { value: value }]
          };
        });

        // 존재하는 카테고리에 서브카테고리와 값 추가
        if (!handledUpdate) {
          updatedSubcategories.push({ category: subcategoryName, values: [{ value }] });
          handledUpdate = true;
        }

        return { ...filter, subcategories: updatedSubcategories };
      })

      // 새로운 카테고리에 새 값 추가
      if (!handledUpdate) {
        return [...prevFilters, { category: category, subcategories: [{ category: subcategoryName, values: [{ value }] }] }];
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

  return (
    <>
      <Container>
        <Row className="mb-5">
          <Conditions onClickedFilter={onClickedFilter} />
        </Row>
        <Row className="mb-5">
          <Filters selectedFilter={selectedFilter} handleClose={handleClose} />
        </Row>
        <Row>
          <NewSubscriptionCards />
        </Row>
      </Container>
    </>
  );
}