import { Container, Stack } from "react-bootstrap";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Condition03Content from "./Condition03Content";

export default function Condition03() {
    return (
        <>
        <Container className="p-5" fluid="md">
            <Stack direction="vertical" gap={5}>
                <Header />
                <Condition03Content />
                <Footer />
            </Stack>
        </Container>
        </>
    );
}