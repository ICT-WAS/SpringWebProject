import Header from '../common/Header'
import ApplyAnnouncementListContent from './ApplyAnnouncementListContent';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';

export default function ApplyAnnouncementList() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <ApplyAnnouncementListContent />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}