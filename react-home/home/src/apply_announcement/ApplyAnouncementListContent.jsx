import { Button, Card, Dropdown, Stack, Table } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import FilteredTag from './FilteredTag';
import Nav from 'react-bootstrap/Nav';
import React, { useState } from 'react';
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
                    <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
                      {subscription.title}
                    </a>
                  </p>
                  </Col>
                </Row>
                <Row>
                  <Col md="auto"><p className='card-body-text'>{subscription.type}</p></Col>
                  <Col md="auto"><p className='card-body-text'>{subscription.region}</p></Col>
                  <Col><p className='card-body-text'>{subscription.date}</p></Col>
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
  /* 임시 데이터 */
  const subscriptions = [
    { title: '화성 비봉지구 B1블록 금성백조 예미지2차', type: '민영', region: '경기도 > 화성시', date: '2024-05-02' },
    { title: '화성 비봉지구 B1블록 금성백조 예미지2차', type: '민영', region: '경기도 > 화성시', date: '2024-05-02' },
    { title: '화성 비봉지구 B1블록 금성백조 예미지2차', type: '민영', region: '경기도 > 화성시', date: '2024-05-02' },
    { title: '화성 비봉지구 B1블록 금성백조 예미지2차', type: '민영', region: '경기도 > 화성시', date: '2024-05-02' }
  ];

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
      <p className='card-body-text mb-0'>0,000 건</p>

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
        <Button variant='dark' style={{ whiteSpace: 'nowrap' }}>
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