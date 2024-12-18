import { Col, Container, Row } from 'react-bootstrap';

function Icons() {
    return (
        <>
            <p className='heading-text'>
                <i className='bi bi-house-door' />
                &nbsp; 청약이지
            </p>

        </>
    );
}

function UseCases() {
    return (
        <>
            <b>Team Project</b>
            <li>
                <a href='https://github.com/ICT-WAS/SpringWebProject' style={{ color: 'black' }}>
                    <i className='bi bi-github' />
                    Github
                </a>
            </li>
            <li>
                <a href='https://www.erdcloud.com/d/wexgffn3Yk58ed9n3' style={{ color: 'black' }}>
                    <i className='bi bi-diagram-3-fill' />
                    ERD 
                </a>
            </li>
            <li>
                <a href='https://www.figma.com/design/iRtj6Mo57gDAbb4nM8n9jL/이현지-(프임)&lsquo;s-team-library?node-id=0-1&t=dQl68pDOBrkS5cyI-1' style={{ color: 'black' }}>
                    <i className='bi bi-ui-radios-grid' />
                    Figma
                </a>
            </li>

        </>
    );
}

function Explore() {
    return (
        <>
            <b>Work</b>
            <li>
                <a href='https://www.figma.com/design/iRtj6Mo57gDAbb4nM8n9jL/이현지-(프임)&lsquo;s-team-library?node-id=0-1&t=dQl68pDOBrkS5cyI-1' style={{ color: 'black' }}>
                    <i className='bi bi-journal' />
                    주택청약 조건 정리
                </a>
            </li>
            <li>
                <a href='https://www.data.go.kr/index.do' style={{ color: 'black' }}>
                    <i className='bi bi-bar-chart-fill' />
                    공공 데이터 포털
                </a>
            </li>
            <li>
                <a href='#' style={{ color: 'black' }}>
                    <i className='bi bi-filetype-ppt' />
                    PPT & 발표자료
                </a>
            </li>

        </>
    );
}

function Resources() {
    return (
        <>
            <b>Together</b >
            <li>
                <a href='https://ictedu.co.kr/index_new.php?main_page=home' style={{ color: 'black' }}>
                    <i className='bi bi-house-door-fill' />
                    한국ICT인재개발원
                </a>
            </li>
            <li>
                <a href='https://ictedu.co.kr/index_new.php?main_page=home' style={{ color: 'black' }}>
                    <i className='bi bi-laptop' />
                    신촌 2강의실 2팀
                </a>
            </li>
            <li>
                <a href='https://ictedu.co.kr/index_new.php?main_page=home' style={{ color: 'black' }}>
                    <i className='bi bi-emoji-laughing' />
                    24.06.10~24.12.26
                </a>
            </li>

        </>
    );
}

export default function Footer() {
    return (
        <>
            <Container className='m-3'>
                <Row>
                    <Col>
                        <Icons />
                    </Col>
                    <Col>
                        <UseCases />
                    </Col>
                    <Col>
                        <Explore />
                    </Col>
                    <Col>
                        <Resources />
                    </Col>
                </Row>
            </Container>
        </>
    );
}