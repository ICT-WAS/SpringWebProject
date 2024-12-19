import { Container, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import CollectionCommentPostContent from "./CollectionCommentPostContent";

export default function CollectionCommentPost() {

    const userId = useParams();

    return (
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <CollectionCommentPostContent />
                <Footer />
            </Stack>
        </Container>
    );
}