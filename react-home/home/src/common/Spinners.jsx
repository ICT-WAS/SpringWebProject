import { Spinner, Stack } from "react-bootstrap";

export default function Spinners() {
    return (
        <div style={{ alignItems: 'center', alignSelf: 'center' }}>
            <Stack direction='horizontal' gap={4}>
                <Spinner animation="grow" variant="secondary" className='' />
                <Spinner animation="grow" variant="secondary" />
                <Spinner animation="grow" variant="secondary" />
            </Stack>
        </div>
    );
}