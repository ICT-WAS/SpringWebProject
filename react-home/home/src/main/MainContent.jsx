import axios from 'axios';
import { Image, Stack } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { SubscriptionCards } from '../apply_announcement/SubscriptionCards';
import CommunityCard from '../community/CommunityCard';
import Spinners from '../common/Spinners';
import { useState, useEffect } from 'react';

function CommunityCards() {

  const [loading, setLoading] = useState(false);

  /* 최근 게시물 5개*/
  const [posts, setPosts] = useState([]);

  // 초기 데이터 로딩
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8989/community", {
        params: {
          page: 1,
          size: 5,
        },
      })
      .then((response) => {
        setPosts(response.data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <p className='heading-text'>
        <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
          커뮤니티 질문 &gt;
        </a>
      </p>
      {loading && <Spinners />}
      {posts.length < 1 && <p className='filter-values'>게시물이 없습니다.</p>}
      <Stack direction='horizontal' gap={3}>
        {/* {communityCardList} */}
        {posts.map((post, index) => {
          return (
            <div key={index} >
              <CommunityCard post={post} />
            </div>
          );
        })}
      </Stack>

    </>
  );
}

function NewSubscriptionCards() {

  const [loading, setLoading] = useState(false);

  /* 최근 공고 5개*/
  const [subscriptions, setSubscriptions] = useState([]);

  // 초기 데이터 로딩
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8989/house", {
        params: {
          orderBy: '최신순',
          page: 1,
          size: 5,
        },
      })
      .then((response) => {
        setSubscriptions(response.data.houseInfoList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
        setLoading(false);
      });
  }, []);


  return (
    <>
      <p className='heading-text'>
        <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
          새로 올라온 공고 &gt;
        </a>
      </p>

      {loading && <Spinners />}
      {subscriptions.length < 1 && <p className='filter-values'>공고가 없습니다.</p>}
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