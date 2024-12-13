import { Button, Card, Dropdown, Stack, Table, Pagination, Form } from 'react-bootstrap';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import FilteredTag from './FilteredTag';
import Nav from 'react-bootstrap/Nav';
import React, { useState, useEffect } from 'react';
import NotificationButton from './NotificationButton';
import { conditions, conditionSubCategory } from './conditions';
import { Range } from "react-range";


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
function NewSubscriptionCards({ subscriptions, totalCount }) {

  const newSubscriptionList = subscriptions.map((subscription, index) =>
    <NewSubscriptionCard
      key={subscription.title + index}
      subscription={subscription}
      index={index}
    />
  );

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
    </>
  );
}

{/* Pagination */ }
function AnnouncementPagination({ onPageChanged, totalCount, pageSize }) {
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);  // 전체 페이지 수

  // 10개 단위로 페이지 범위 계산
  const rangeStart = Math.floor((currentPage - 1) / 10) * 10 + 1;  // 현재 페이지를 기준으로 시작 페이지
  const rangeEnd = Math.min(rangeStart + 9, totalPages);  // 시작 페이지 + 9 (최대 10개까지 표시)

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChanged(pageNumber);
  };

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

/* 선택된 태그 목록*/
function Filters({ selectedFilter, handleClose, handleFilterButtonClick }) {

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
        <Button variant='dark' style={{ whiteSpace: 'nowrap' }} onClick={() => handleFilterButtonClick({ selectedFilter: selectedFilter })}>
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
        <Nav.Item style={{ color: 'gray' }}>
          <Nav.Link className='condition-nav' eventKey="WishRegion">희망지역</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className='condition-nav' eventKey="HomeInfo">주택정보</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className='condition-nav' eventKey="ApplicationPeriod">모집정보</Nav.Link>
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
                <td data-subcategory-index={subcategoryIndex}
                  data-subcategory={category}
                  data-index={index} data-value={item.value}>{item.value}</td>
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
    const index = e.target.getAttribute('data-index');
    const subcategoryName = sidoData[sidoIndex].category;

    let submitData = null;
    if (index >= 0) {
      submitData = sidoData[sidoIndex].category + ' ' + gunguData[index].value;
    }

    onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue, submitData: submitData });
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
                  <td data-index={-1} data-value={sidoData[sidoIndex].category + ' 전체'}>{'전체'}</td>
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
    const submitData = selectedValue.split('(')[0];
    onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue, submitData: submitData });
  }

  const subCategorieSections = () => {
    return subcategories.map((subCategory, index) =>
      <SubcategorySection key={subCategory + index}
        subcategoryIndex={index}
        category={subCategory.category}
        values={subCategory.values}
        handleClick={handleClick} />
    );
  }

  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
        {subCategorieSections()}

        {/* 공급금액 */}
        <SupplyPirce categoryName={categoryName} onClickedFilter={onClickedFilter} />

      </Stack>
    </>
  );
}

/* 공급금액 */
// 단위 : 만
function SupplyPirce({ categoryName, onClickedFilter }) {

  const subCategoryName = '공급금액';
  const [values, setValues] = useState([0, 150000]); // 초기 값 [최소, 최대]
  const [minPrice, setMinPrice] = useState('0만');
  const [maxPrice, setMaxPrice] = useState('15억');

  function handleRangeChanged(newValues) {
    setValues(newValues);

    const newMinPrice = formatCurrency(newValues[0]);
    const newMaxPrice = formatCurrency(newValues[1]);
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);

    const newVlaue = newMinPrice + " ~ " + newMaxPrice;
    onClickedFilter({ category: categoryName, subcategoryName: subCategoryName, value: newVlaue, submitData: newValues });
  }

  return (
    <>
      <div className='border-div'>
        <p className='filter-category'>
          {subCategoryName}
        </p>
        <hr className='p-text' />
        <div className="scrollable-table">
          <Table hover borderless>
            <tbody>
              <tr>
                <td data-min={values[0]} data-max={values[1]}>
                  <TwoHandleRange onChangeValue={handleRangeChanged} />
                </td>
              </tr>
              <tr>
                <td>
                  {minPrice} ~ {maxPrice}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

function TwoHandleRange({ onChangeValue }) {

  const [values, setValues] = useState([0, 150000]); // 초기 값 [최소, 최대]

  function onChangeVal(newValues) {
    setValues(newValues);

    if (onChangeValue) {
      onChangeValue(newValues);
    }
  }

  return (
    <div style={{ margin: "2rem", width: "300px" }}>
      <Range
        step={1000} // 핸들 이동 간격
        min={0} // 최소값
        max={150000} // 최대값
        values={values}
        onChange={onChangeVal}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              height: "6px",
              width: "100%",
              background: "lightgray",
              borderRadius: "3px",
              position: "relative",
            }}
          >
            {/* 선택된 구간 강조 */}
            <div
              style={{
                position: "absolute",
                height: "6px",
                background: "blue",
                borderRadius: "3px",
                left: `${((values[0] - props.min) / (props.max - props.min)) * 100}%`,
                right: `${100 - ((values[1] - props.min) / (props.max - props.min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            style={{
              height: "30px", // 핸들러 크기 증가
              width: "60px",
              background: "black", // 핸들 색상 강조
              borderRadius: "15px",
              outline: "none",
              border: "2px solid white", // 테두리 추가
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)", // 그림자 효과
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {index === 0 ? "최저" : "최고"}
          </div>
        )}
      />
    </div>
  );
}

function formatCurrency(amount) {
  if (amount === 0) return "0만";

  let result = "";

  const units = ["만", "억", "조"];
  let unitIndex = 0;

  while (amount > 0) {
    const part = amount % 10000; // 10,000 단위로 나눔
    if (part > 0) {
      const formattedPart = new Intl.NumberFormat('ko-KR').format(part);
      result = `${formattedPart}${units[unitIndex]} ${result}`.trim();
    }
    amount = Math.floor(amount / 10000); // 다음 단위로 넘어감
    unitIndex++;
  }

  return result.trim();
}

/* 모집정보 */
function ApplicationPeriod({ onClickedFilter }) {

  const categoryName = conditions.applicationPeriod.category;
  const subcategories = conditions.applicationPeriod.subcategories;

  function handleClick(e) {
    const selectedValue = e.target.getAttribute('data-value');
    const subcategoryIndex = e.target.getAttribute('data-subcategory-index');
    const subcategoryName = subcategories[subcategoryIndex].category;
    onClickedFilter({ category: categoryName, subcategoryName: subcategoryName, value: selectedValue, submitData: selectedValue });
  }

  const subCategorieSections = () => {
    return subcategories.map((subCategory, index) =>
      <SubcategorySection key={subCategory + index}
        subcategoryIndex={index}
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

  function handleFilterButtonClick({selectedFilter}) {
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
          <NewSubscriptionCards subscriptions={subscriptions} totalCount={totalCount} />
        </Row>
        <Row>
          <AnnouncementPagination onPageChanged={onPageChanged} totalCount={totalCount} pageSize={pageSize} />
        </Row>
      </Container>
    </>
  );
}

function convertFiltersToUrl(filters) {
  let queryParams = {};

  Object.keys(filters).forEach(key => {
    filters[key].forEach((value, index) => {
      // 배열 항목을 쿼리 파라미터로 변환할 때, 두 번째 인코딩을 방지
      queryParams[`${key}%5B${index}%5D`] = value; // 이 부분에서 두 번째 인코딩을 피합니다.
    });
  });

  return queryParams;
}