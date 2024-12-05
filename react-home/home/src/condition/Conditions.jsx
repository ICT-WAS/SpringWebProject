import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Conditions() {

    const navigate = useNavigate();

    function handleClick(e) {
        navigate("/condition-1");
    }

    return (
        <>
        <Button variant="dark" onClick={handleClick}>조건 등록</Button>

        </>
    );
}