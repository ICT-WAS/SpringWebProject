import { Button, Card, Stack, Table } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FilteredTag from './FilteredTag';
import Nav from 'react-bootstrap/Nav';
import React, { useState } from 'react';

function NotificationButton() {
  return (
    <>
      <DropdownButton
        variant="outline-secondary"
        title="알림🔔"
        id="input-group-dropdown-2"
        align="end"
      >

        <Dropdown.Item href="#">모두 알림</Dropdown.Item>
        <Dropdown.Item href="#">일반 알림</Dropdown.Item>
        <Dropdown.Item href="#">특별 알림</Dropdown.Item>
      </DropdownButton>
    </>
  );
}

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
      <Stack direction='vertical' gap={3}>
        {newSubscriptionList}
      </Stack>
    </>
  );
}

function Filters() {
  return (
    <>

      <Container>
        <Row>
          <Col>
            <p className='filter-category'>
              희망지역
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Stack direction="horizontal" gap={2}>
              <FilteredTag filterName={'서울 전체'} />
              <FilteredTag filterName={'경기도 광명시'} />
              <FilteredTag filterName={'경기도 성남시'} />
            </Stack>
          </Col>
        </Row>
      </Container>
      <div>
        <p className='filter-values'>

        </p>
      </div>
    </>
  );
}

function Conditions() {

  const conditionCards = {
    WishRegion: WishRegion,
    HomeInfo: HomeInfo,
    ApplicationPeriod: ApplicationPeriod
  };
  const [selectedCondition, setSelectedCondition] = useState(conditionCards['WishRegion']());

  const handleSelect = (eventKey) => {
    if (conditionCards[eventKey]) {
      const result = conditionCards[eventKey]();
      setSelectedCondition(result);
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

function WishRegion() {
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
                <tr>
                  <td>서울특별시</td></tr>
                <tr>
                  <td>부산광역시</td></tr>
                <tr>
                  <td>대구광역시</td></tr>
                <tr>
                  <td>인천광역시</td></tr>
                <tr>
                  <td>광주광역시</td></tr>
                <tr>
                  <td>대전광역시</td></tr>
                <tr>
                  <td>울산광역시</td></tr>
                <tr>
                  <td>세종특별자치시</td></tr>
                <tr>
                  <td>경기도</td></tr>
                <tr>
                  <td>충청북도</td></tr>
                <tr>
                  <td>충청남도</td></tr>
                <tr>
                  <td>전라남도</td></tr>
                <tr>
                  <td>경상북도</td></tr>
                <tr>
                  <td>경상남도</td></tr>
                <tr>
                  <td>강원특별자치도</td></tr>
                <tr>
                  <td>전북특별자치도</td></tr>
                <tr>
                  <td>제주특별자치도</td></tr>
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
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
                <tr>
                  <td>서울시 전체</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Stack>
    </>
  );
}

function HomeInfo() {
  return (
    <>
      <Stack direction='horizontal' style={{ width: '100%', padding: '0' }} gap={1}>
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

function ApplicationPeriod() {
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
            상세조회
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


      </Stack>
    </>
  );
}

export default function MainContent() {
  return (
    <>
      <Container>
        <Row className="mb-5">
          <Conditions />
        </Row>
        <Row className="mb-5">
          <Filters />
        </Row>
        <Row>
          <NewSubscriptionCards />
        </Row>
      </Container>
    </>
  );
}