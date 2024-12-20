import Header from '../common/Header'
import ApplyAnnouncementContent from './ApplyAnouncementListContent';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';

export default function ApplyAnnouncementList() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <ApplyAnnouncementContent />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}