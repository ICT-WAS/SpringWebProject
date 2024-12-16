import Header from '../common/Header'
import PostDetailContent from './PostDetailContent'
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';
import { useParams } from 'react-router-dom';

export default function PostDetail() {
    const { postId } = useParams();

    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                    <PostDetailContent postId={postId} />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}