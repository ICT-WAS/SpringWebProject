import Header from '../common/Header'
import ApplyAnnouncementContent from './ApplyAnouncementContent';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';
import { useParams } from 'react-router-dom';

export default function ApplyAnnouncement() {

    const { houseId } = useParams();

    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <ApplyAnnouncementContent houseId={houseId} />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}