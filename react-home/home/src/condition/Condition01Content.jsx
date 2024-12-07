import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputNumberItem, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { conditions } from '../apply_announcement/conditions';

export default function Condition01Content() {

    const navigate = useNavigate();

    const houseHolderButtons = { name: 'isHouseholder', values: [{ value: '세대원' }, { value: '세대주' }] }
    const marriedButtons = { name: 'isMarried', values: [{ value: '미혼' }, { value: '기혼', hasFollowUpQuestion: true }, { value: '예비신혼부부' }, { value: '한부모' }] }

    /* 제출용 데이터 */
    const [formData, setFormData] = useState({});

    /* 꼬리질문 가시성 */
    const followUpQuestions = { isMarried: 'marriageDate', moveInDate: 'metropolitanDate' };
    const [visibility, setVisibility] = useState({ marriageDate: false, metropolitanDate: true });

    function handleClick(e) {

        console.log(formData);

        // 기존의 폼 데이터 유지한채로 페이지 이동? 데이터를 같이 보내?
        navigate("/condition-2");
    }

    function onChangedInputValue({ name, value }) {
        const questionName = followUpQuestions[name];

        setFormData(prevFormData => {
            const { [questionName]: _, ...filteredData } = prevFormData;

            return {
                ...filteredData,
                [name]: value
            };
        });
    }

    function handleFollowUpQuestion({ name, visible }) {
        const questionName = followUpQuestions[name];

        setVisibility(prevVisibility => ({
            ...prevVisibility,
            [questionName]: visible
        }));
    }

    return (
        <Form>
            <Stack direction='vertical' gap={5} >

                {/* 신청자 생년월일 */}
                <InputNumberItem number={1} question={'신청자 생년월일'}
                    name={'userBirth'} onChange={onChangedInputValue} placeholder={'19991210'} />

                {/* 현재 거주지 */}
                <MoveInDate onChangedInputValue={onChangedInputValue} />

                {/* 현재 거주지에 입주한 날 */}
                <InputNumberItem number={3} question={'현재 거주지에 입주한 날(주민등록표등본에 있는 전입일자)'}
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={'20100101'} />

                {/* [꼬리질문] 경기에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion1 onChangedInputValue={onChangedInputValue}
                    visibility={visibility['metropolitanDate']} placeholder={'20100101'} />

                {/* [꼬리질문] 서울, 경기, 인천에에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion2 onChangedInputValue={onChangedInputValue}
                    visibility={visibility['metropolitanDate']} placeholder={'20100101'} />

                {/* 세대주 여부 */}
                <RadioButtonItem number={4} question={'세대주 여부'}
                    buttons={houseHolderButtons} direction={'horizontal'} onChange={onChangedInputValue} />

                {/* 결혼 여부 */}
                <RadioButtonItem number={5} question={'결혼을 하셨습니까?'}
                    buttons={marriedButtons} direction={'vertical'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 혼인신고일 */}
                <MarriedFollwUpQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['marriageDate']} />

                {/* 다음으로 */}
                <Button variant="dark" onClick={handleClick}>다음</Button>
            </Stack>

        </Form>
    );
}

{/* 거주지역 - 현재 사는 지역 */ }
function MoveInDate({ onChangedInputValue }) {
    
    const [sidoSelectedName, setSidoSelectedName] = useState('시/도');
    const [gunguSelectedName, setGunguelectedName] = useState('군/구');

    const sidoData = conditions.wishRegion.subcategories;
    const [sidoIndex, setSidoIndex] = useState(0);
    const [gunguData, setGunguData] = useState([{value: '군/구'}]);

    function handleChangedSidoDropdown({index}) {
        setSidoIndex(index);
        setGunguData(sidoData[index].values);
        setSidoSelectedName(sidoData[index].category);
        setGunguelectedName('군/구');
    }

    function handleChangedGuGunDropdown({index}) {
        setGunguelectedName(gunguData[index].value);
        // 값 저장
    }

    const sidoList = () => {
        return sidoData.map((item, index) => (
            <Dropdown.Item href="#/action-1" key={index}
                onClick={() => handleChangedSidoDropdown({index: index})}>
                {item.category}
            </Dropdown.Item>
        ));
    }

    const gunguList = () => {
        return gunguData.map((item, index) => (
            <Dropdown.Item href="#/action-1" key={index}
            onClick={() => handleChangedGuGunDropdown({index: index})}>
                {item.value}
            </Dropdown.Item>
        ));
    }

    return (
        <>
            <div>
                <p className="card-header-text">현재 거주지</p>
                <Stack direction='horizontal' gap={2} >
                    <Dropdown style={{ flex: 1 }}>
                        <Dropdown.Toggle variant="warning" className='dropdown-transparent flex-fill' >
                            {sidoSelectedName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {sidoList()}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown style={{ flex: 1 }} >
                        <Dropdown.Toggle variant="warning" className='dropdown-transparent flex-fill' >
                            {gunguSelectedName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {gunguList()}
                        </Dropdown.Menu>
                    </Dropdown>
                </Stack>
            </div>

        </>
    );
}

{/* 거주지역 - 경기에 거주하기 시작한 날 */ }
function MoveInFollwUpQuestion1({ onChangedInputValue, visibility }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem number={'3-1'} question={'경기에 거주하기 시작한 날'} depth={3}
            name={'metropolitanDate'} onChange={onChangedInputValue} placeholder={'20100101'} />
    );
}

{/* 거주지역 - 서울, 경기, 인천에 거주하기 시작한 날 */ }
function MoveInFollwUpQuestion2({ onChangedInputValue, visibility }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem number={'3-2'} question={'서울, 경기, 인천에 거주하기 시작한 날'} depth={3}
            name={'metropolitanDate'} onChange={onChangedInputValue} placeholder={'20100101'} />
    );
}

{/* 결혼 여부 - 혼인신고일 */ }
function MarriedFollwUpQuestion({ onChangedInputValue, visibility }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem number={'5-1'} question={'혼인신고일'} depth={3}
            name={'marriageDate'} onChange={onChangedInputValue} placeholder={'20100101'} />
    );
}