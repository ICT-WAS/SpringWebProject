import { Image, Stack } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import {SubscriptionCards} from '../apply_announcement/SubscriptionCards';
import CommunityCard from '../community/CommunityCard';

function CommunityCards() {

  
  /* 최근 게시물 5개*/
  const posts = [
    {title: '임시 데이터', subject: '임시에요~~', createdAt: new Date(), postId: 123, user : {username: '이현지'}},
    {title: '임시 데이터', subject: '임시에요~~', createdAt: new Date(), postId: 123, user : {username: '이현지'}},
    {title: '임시 데이터', subject: '임시에요~~', createdAt: new Date(), postId: 123, user : {username: '이현지'}},
    {title: '임시 데이터', subject: '임시에요~~', createdAt: new Date(), postId: 123, user : {username: '이현지'}},
    {title: '임시 데이터', subject: '임시에요~~', createdAt: new Date(), postId: 123, user : {username: '이현지'}},
   ];

  return (
    <>
      <p className='heading-text'>
        <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
          커뮤니티 질문 &gt;
        </a>
      </p>
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
  /* 최근 공고 5개*/
  const subscriptions = [ 
    {houseId: 1, houseNm: '임시 데이터', type: '일반', region1: '경기도', region2: '광명시', rcritPblancDe: '2024-12-13'},
    {houseId: 1, houseNm: '임시 데이터', type: '일반', region1: '경기도', region2: '광명시', rcritPblancDe: '2024-12-13'},
    {houseId: 1, houseNm: '임시 데이터', type: '일반', region1: '경기도', region2: '광명시', rcritPblancDe: '2024-12-13'},
    {houseId: 1, houseNm: '임시 데이터', type: '일반', region1: '경기도', region2: '광명시', rcritPblancDe: '2024-12-13'},
    {houseId: 1, houseNm: '임시 데이터', type: '일반', region1: '경기도', region2: '광명시', rcritPblancDe: '2024-12-13'},
  ];

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