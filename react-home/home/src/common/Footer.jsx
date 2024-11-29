import { Col, Container, Row } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';

function Icons() {
    return(
        <>
        <p>
        <i className='bi bi-house-door' />
        
        </p>
        <p>
        <i className='bi bi-house-door' />
        <i className='bi bi-house-door' />
        <i className='bi bi-house-door' />
        </p>
        </>
    );
}

function UseCases() {
    return(
        <>
        <ol> <b>UseCases</b>
            <li>
                UI design
            </li>
            <li>
                UX design
            </li>
            <li>
                Wireframing
            </li>
        </ol>
        </>
    );
}

function Explore() {
    return(
        <>
        <ol> <b>UseCases</b>
            <li>
                UI design
            </li>
            <li>
                UX design
            </li>
            <li>
                Wireframing
            </li>
        </ol>
        </>
    );
}

function Resources() {
    return(
        <>
        <ol> <b>UseCases</b>
            <li>
                UI design
            </li>
            <li>
                UX design
            </li>
            <li>
                Wireframing
            </li>
        </ol>
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