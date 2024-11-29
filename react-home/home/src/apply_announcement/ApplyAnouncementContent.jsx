import { Card, Image, Stack } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import CommunityCard from '../community/CommunityCard';

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

function NewSubscriptionCard({subscription}) {
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
    {title:'화성 비봉지구 B1블록 금성백조 예미지2차', type:'민영', region:'경기도 > 화성시', date:'2024-05-02'},
    {title:'화성 비봉지구 B1블록 금성백조 예미지2차', type:'민영', region:'경기도 > 화성시', date:'2024-05-02'},
    {title:'화성 비봉지구 B1블록 금성백조 예미지2차', type:'민영', region:'경기도 > 화성시', date:'2024-05-02'},
    {title:'화성 비봉지구 B1블록 금성백조 예미지2차', type:'민영', region:'경기도 > 화성시', date:'2024-05-02'}
  ];

  const newSubscriptionList = subscriptions.map(subscription =>
    NewSubscriptionCard({subscription})
  );

  return (
    <>
    <p className='heading-text'>
        <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
          새로 올라온 공고 &gt;
        </a>
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
  return (
    <>

    </>
  );
}

export default function MainContent() {
  return (
    <>
      <Container>
        <Row className="mb-5">
          <Col>
            <div className="main-image-container">
              <Image
                src="https://flexible.img.hani.co.kr/flexible/normal/900/670/imgdb/original/2024/0701/20240701502688.jpg"
                className='main-image'
                fluid
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col>
            <Conditions />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewSubscriptionCards />
          </Col>
        </Row>
      </Container>
    </>
  );
}