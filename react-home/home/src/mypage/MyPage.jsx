import { Container, Stack } from "react-bootstrap";
import Header from "../common/Header";
import Footer from "../common/Footer";
import MyPageContent from "./MyPageContent";
import { getUserIdFromToken } from "../api/TokenUtils";

export default function MyPage() {
    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    if(userId === null){
        window.location.href = '/login';
    }

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
