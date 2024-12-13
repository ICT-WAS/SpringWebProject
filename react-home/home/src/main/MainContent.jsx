import { Image, Stack } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import SubscriptionCards from '../apply_announcement/SubscriptionCards';

function CommunityCards() {
  /* 최근 게시물 5개*/
  const communityInfo = [ ];

  return (
    <>
      <p className='heading-text'>
        <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
          커뮤니티 질문 &gt;
        </a>
      </p>
      <Stack direction='horizontal' gap={3}>
        {/* {communityCardList} */}
      </Stack>
      
    </>
  );
}

function NewSubscriptionCards() {
  /* 최근 공고 5개*/
  const subscriptions = [ ];

  return (
    <>
    <p className='heading-text'>
        <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
          새로 올라온 공고 &gt;
        </a>
      </p>
      <Stack direction='vertical' gap={3}>
        <SubscriptionCards subscriptions={subscriptions} />
        </Stack>
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
            <CommunityCards />
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