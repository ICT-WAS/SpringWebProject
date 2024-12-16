import { Container, Stack } from "react-bootstrap";
import Header from "../common/Header";
import Footer from "../common/Footer";
import MyPageContent from "./MyPageContent";

export default function MyPage() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <MyPageContent />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}
