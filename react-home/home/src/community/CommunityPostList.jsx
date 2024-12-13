import Header from '../common/Header'
import CommunityPostListContent from './CommunityPostListContent';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';

export default function CommunityPostList() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <h1 className="text-center">커뮤니티</h1>
                <CommunityPostListContent />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}