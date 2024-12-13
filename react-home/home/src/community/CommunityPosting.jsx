import Header from '../common/Header'
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import CummunityPostingContent from './CommunityPostingContent'
import Footer from '../common/Footer';

export default function CommunityPostList() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                    <CummunityPostingContent/>
                <Footer />
            </Stack>
        </Container>
        </>
    );
}