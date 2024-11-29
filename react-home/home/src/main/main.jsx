import Header from '../common/Header'
import MainContent from "./MainContent";
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';

export default function Main() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <MainContent />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}