import { Button, Card, CardBody, Col, Container, Row, Stack } from "react-bootstrap";

export default function MyPageContent() {

    return (
        <>
            <p className='heading-text'>
                마이페이지
            </p>
            <Stack direction='vertical' gap={5} >
                <Card>
                    <Card.Header>
                        내 조건
                    </Card.Header>
                    <Card.Body>
                        청약통장 어쩌고
                    </Card.Body>
                </Card>

                <p className='heading-text'>
                    모아보기
                </p>
                <Container fluid>
                    <Row>
                        <Col >
                            <MyMenuCard name={"찜한 공고"} total={21} iClassName={"bi-suit-heart"} />
                        </Col>
                        <Col >
                            <MyMenuCard name={"내가 쓴 글"} total={1} iClassName={"bi-feather"} />
                        </Col>
                        <Col >
                            <MyMenuCard name={"내가 쓴 댓글"} total={3} iClassName={"bi-chat-left-dots"} />
                        </Col>
                    </Row>
                </Container>
            </Stack>
        </>
    );
}

function MyMenuCard({ name, total, iClassName }) {
    return (
        <>
            <Card>
                <Button className="btn-mypage-card" style={{ textAlign: 'left'}}>
                    <CardBody >
                        <p className='heading-text'>
                            {name}<br />
                        </p>
                        <b>
                            <i className={`bi ${iClassName}`} style={{ fontSize: '2.5rem' }} />
                        </b>
                        <span className="px-4 ">{total}건</span>
                    </CardBody>

                </Button>
            </Card>
        </>
    );
}