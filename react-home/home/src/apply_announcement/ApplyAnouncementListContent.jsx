import { Button, Card, Dropdown, Stack, Table } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import FilteredTag from './FilteredTag';
import Nav from 'react-bootstrap/Nav';
import React, { useState } from 'react';
import NotificationButton from './NotificationButton';
import { conditions } from './conditions';


function NewSubscriptionCard({ subscription }) {
  return (
    <>
      <Container>
        <Card body>
          <Row>
            <Col>
              <Container>
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

  const newSubscriptionList = subscriptions.map(subscription =>
    NewSubscriptionCard({ subscription })
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

    const subcategoriesTag = subcategories.map((sub) => {
      return <><FilteredTag filterName={sub.value} handleClose={handleClose} /></>;
    })

    return (
      <>
        <Row>
          <Col>
            <p className='filter-category mb-2'>
              {filter.category}
            </p>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col>
            <Stack direction="horizontal" gap={2}>
              {subcategoriesTag}
            </Stack>
          </Col>
        </Row>
      </>
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

/* 희망지역 */
function WishRegion({ onClickedFilter }) {

  const category = conditions.wishRegion.category;
  const sidoData = conditions.wishRegion.subcategories;
  const [gunguData, setGunguData] = useState(conditions.wishRegion.subcategories[0].values);

  function handleClickSido(e) {
    const index = e.target.getAttribute('data-index');
    setGunguData(conditions.wishRegion.subcategories[index].values);
  }

  function handleClick(e) {
    const selectedValue = e.target.getAttribute('data-value');
    onClickedFilter({ category: category, subcategoryId: e.target.getAttribute('data-index'), value: selectedValue });
  }

  const sidoList = () => {
    return sidoData.map((item, index) => (
      <tr key={index} onClick={handleClickSido}>
        <td data-index={index} data-value={item.subcategoryName}>{item.subcategoryName}</td>
      </tr>
    ));
  }

  const gunguList = () => {
    return gunguData.map((item, index) => (
      <tr key={index} onClick={handleClick}>
        <td data-index={index} data-value={item.value}>{item.value}</td>
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

  const subcategories = conditions.homeInfo.subcategories;

  function handleClick(e) {
    const selectedValue = e.target.getAttribute('data-value');
    const selectedIndex = e.target.getAttribute('data-index');
    onClickedFilter({ category: conditions.homeInfo.category, subcategoryId: selectedIndex, value: selectedValue });
  }

  function subcategorySection({ category, values }) {
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
              <tr key={index} onClick={handleClick}>
                <td data-index={index} data-value={item.value}>{item.value}</td>
              </tr>
              ))}

            </tbody>

          </Table>
        </div>
      </div>
    </>
  }

  const subCategorieSections = () => {
    return subcategories.map((subCategory) => {
      subcategorySection({category: subCategory.category, values: subCategory.values});
    });
  }

  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
        {subCategorieSections()}

        <div className='border-div'>
          <p className='filter-category'>
            주택분류
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td>국민주택</td></tr>
                <tr>
                  <td>민영주택</td></tr>
                <tr>
                  <td>무순위</td></tr>
              </tbody>

            </Table>
          </div>
        </div>

        <div className='border-div'>
          <p className='filter-category'>
            면적
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td>85m² 미만</td>
                </tr>
                <tr>
                  <td>85m² 이상 100m² 미만</td>
                </tr>
                <tr>
                  <td>85m² 미만</td>
                </tr>
                <tr>
                  <td>85m² 미만</td>
                </tr>
                <tr>
                  <td>85m² 미만</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        <div className='border-div'>
          <p className='filter-category'>
            공급금액
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td>1개월 이상</td>
                </tr>
                <tr>
                  <td>6개월 이상</td>
                </tr>
                <tr>
                  <td>1년 이상</td>
                </tr>
                <tr>
                  <td>2년 이상</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        <div className='border-div'>
          <p className='filter-category'>
            특별공급
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td>다자녀가구</td>
                </tr>
                <tr>
                  <td>신혼부부</td>
                </tr>
                <tr>
                  <td>생애최초</td>
                </tr>
                <tr>
                  <td>청년</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

      </Stack>
    </>
  );
}

/* 모집기간 */
function ApplicationPeriod({ onClickedFilter }) {
  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>

        <div className='border-div'>
          <p className='filter-category'>
            접수상태
          </p>
          <hr className='p-text' />
          <div className="scrollable-table">
            <Table hover borderless>
              <tbody>
                <tr>
                  <td>접수전</td></tr>
                <tr>
                  <td>접수중</td></tr>
                <tr>
                  <td>계약중</td></tr>
              </tbody>

            </Table>
          </div>
        </div>

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

  /* 필터 적용시 */
  function onClickedFilter({ category, subcategoryId, value }) {

    setSelectedFilter((prevFilters) => {
      let handledUpdate = false;

      const updatedFilters = prevFilters.map((filter) => {
        if (filter.category !== category) {
          return filter;
        }

        // 존재하는 옵션값 바뀌었을 때(최대n개?)
        const updatedSubcategories = filter.subcategories.map((sub) => {
          if (sub.subcategoryId === subcategoryId) {
            handledUpdate = true;
            return { ...sub, value: value };
          } else {
            return sub;
          }
        });

        // 존재하는 카테고리에 값을 추가할 때
        if (!handledUpdate) {
          updatedSubcategories.push({ subcategoryId: subcategoryId, value: value });
          handledUpdate = true;
        }

        return { ...filter, subcategories: updatedSubcategories };
      })

      // 새로운 카테고리에 새 값 추가
      if (!handledUpdate) {
        return [...prevFilters, { category: category, subcategories: [{ subcategoryId: subcategoryId, value: value }] }];
      }

      return updatedFilters;
    });

  }

  /* 필터 삭제시 */
  function handleClose(filterName) {
    setSelectedFilter((prevFilters) =>
      prevFilters.map(filter => ({
        ...filter, subcategories:
          filter.subcategories.filter(sub => sub.value !== filterName)
      }))
        .filter((filter) => filter.subcategories.length > 0)
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