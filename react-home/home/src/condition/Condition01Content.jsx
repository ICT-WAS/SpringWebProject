import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import RadioButtonItem from "./RadioButtonItem";
import { useNavigate } from "react-router-dom";

export default function Condition01Content() {

    const navigate = useNavigate();

    const houseHolderButtons = { name: 'isHouseholder', values: [{ value: '세대원' }, { value: '세대주' }] }
    const marriedButtons = { name: 'isMarried', values: [{ value: '미혼' }, { value: '기혼' }, { value: '예비신혼부부' }, { value: '한부모' }] }

    function handleClick(e) {
        navigate("/condition-2");
    }

    return (
        <Form>
            <Stack direction='vertical' gap={5} >

                {/* 신청자 생년월일 */}
                <div>
                    <p className="card-header-text">신청자 생년월일</p>
                    <Form.Control
                        type="text"
                        id="inputPassword5"
                        maxLength={8}
                        aria-describedby="passwordHelpBlock"
                        placeholder="19991210"
                        required
                    />
                </div>

                {/* 현재 거주지 */}
                <div>
                    <p className="card-header-text">현재 거주지</p>
                    <Stack direction='horizontal' gap={2} >
                        <Dropdown style={{ flex: 1 }}>
                            <Dropdown.Toggle variant="warning" className='dropdown-transparent flex-fill' >
                                시/도
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">서울특별시</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown style={{ flex: 1 }}>
                            <Dropdown.Toggle variant="warning" className='dropdown-transparent flex-fill' >
                                구/군
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">서울특별시</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Stack>
                </div>

                {/* 세대주 여부 */}
                <div>
                    <p className="card-header-text">세대주 여부</p>
                    <Stack direction='horizontal' gap={2} >
                        <RadioButtonItem buttons={houseHolderButtons} />
                    </Stack>
                </div>


                {/* 결혼 여부 */}
                <div>
                    <p className="card-header-text">결혼을 하셨습니까?</p>
                    <Stack direction='vertical' gap={2} >
                        <RadioButtonItem buttons={marriedButtons} />
                    </Stack>
                </div>


                <Button variant="dark" onClick={handleClick}>다음</Button>
            </Stack>

        </Form>
    );
}