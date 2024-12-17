import Header from '../common/Header'
import ApplyAnnouncementContent from './ApplyAnouncementListContent';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';
import { useParams } from 'react-router-dom';
import SearchAnnouncementByNameContent from './SearchAnnouncementByNameContent';

export default function SearchAnnouncementByName() {
    const { keyword } = useParams();
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <SearchAnnouncementByNameContent keyword={keyword} />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}