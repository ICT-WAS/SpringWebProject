import { Container, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../common/Header";
import CollectionPostContent from "./CollectionPostContent";
import Footer from "../common/Footer";

export default function CollectionPost() {

    const userId = useParams();

    return (
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <CollectionPostContent />
                <Footer />
            </Stack>
        </Container>
    );
}