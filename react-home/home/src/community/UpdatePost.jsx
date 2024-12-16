import Header from '../common/Header'
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import UpdatePostContent from './UpdatePostContent'
import Footer from '../common/Footer';
import { useParams } from 'react-router-dom';

export default function UpdatePost() {
    const { postId } = useParams();

    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                    <UpdatePostContent postId={postId}/>
                <Footer />
            </Stack>
        </Container>
        </>
    );
}