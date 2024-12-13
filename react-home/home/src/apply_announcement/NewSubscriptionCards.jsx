import { Card, Col, Container, Dropdown, Row, Stack } from "react-bootstrap";
import NotificationButton from "./NotificationButton";


/* 공고 리스트 */
export default function NewSubscriptionCards({ subscriptions, totalCount }) {

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
