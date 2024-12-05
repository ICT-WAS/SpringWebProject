import { Container, Stack } from "react-bootstrap";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Condition01Content from "./Condition01Content";

export default function Condition02() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <Condition01Content />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}