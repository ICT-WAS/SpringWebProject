import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputNumberItem, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { conditions } from '../apply_announcement/conditions';
import { placeholderText } from "./placeholderText";

export default function Condition01Content() {

    const navigate = useNavigate();

    const houseHolderButtons = { name: 'householder', values: [{ data: '세대원', value: 'N', }, { data: '세대주', value: 'Y', }] }
    const marriedButtons = { name: 'married', values: [{ data: '미혼', value: 0 }, { data: '기혼', value: 1, hasFollowUpQuestion: true }, { data: '예비신혼부부', value: 2 }, { data: '한부모', value: 3 }] }

    /* 제출용 데이터 */
    const [formData, setFormData] = useState({});

    /* 꼬리질문 가시성 */
    const followUpQuestions = { married: [{value: 1, subQuestionId: 'marriedDate'}], moveInDate: [{value: 1, subQuestionId: 'metropolitanAreaDate'}, {value: 2, subQuestionId: 'regionMoveInDate'}] };
    const [visibility, setVisibility] = useState({ marriedDate: false, metropolitanAreaDate: false, regionMoveInDate: false });

    useEffect(() => {
        const keysToRemove = Object.keys(visibility).filter(
            (key) => visibility[key] === false
        );

        if (keysToRemove.length > 0) {
            setFormData((prev) => {
                const updatedFormData = { ...prev };
                keysToRemove.forEach((key) => {
                    delete updatedFormData[key]; // false인 키를 삭제
                });
                return updatedFormData;
            });
        }
    }, [visibility]);

    function handleClick(e) {
        // 폼 데이터 저장
        sessionStorage.setItem('formData1', JSON.stringify(formData));
        console.log(formData);

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

    function changeVisibility({condition, name}) {
        setVisibility((prev) => {
            if(condition) {
                return {...prev, [name]: true};                                                               
            } else {
                return {...prev, [name]: false};
            }
        });
        setFormData((prev) => {
            if(condition) {
                return prev;                                                               
            } else {
                const {[name]: _, ...rest} = prev;
                return rest;
            }
        })
    }

    // value는 상위 질문 옵션값임
    function handleFollowUpQuestion({ name, value, visible }) {
        const matchedItem = followUpQuestions[name];
        
        if (!matchedItem || matchedItem.length < 1) {
            return;
        }

        matchedItem.forEach((item) => {

            const questionName = item.subQuestionId;
            handleFollowUpQuestion({name: questionName});

            let subQuestionVisibility = false;
            if(item.value === value) {
                subQuestionVisibility = true;
            }
        
            setVisibility((prevVisibility) => ({
                ...prevVisibility,
                [questionName]: subQuestionVisibility,
            }));
        });
    }

    return (
        <Form>
            <Stack direction='vertical' gap={5} >

                {/* 신청자 생년월일 */}
                <InputNumberItem number={1} question={'신청자 생년월일'}
                    name={'birthday'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />

                {/* 현재 거주지 */}
                <MoveInDate onChangedInputValue={onChangedInputValue} changeVisibility={changeVisibility} />

                {/* 현재 거주지에 입주한 날 */}
                <InputNumberItem number={3} question={`${formData.gunGu ?? 'OOO'}에 입주한 날(주민등록표등본에 있는 전입일자)`}
                    name={'transferDate'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />

                {/* [꼬리질문] 현재 지역(시/도)에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion1 onChangedInputValue={onChangedInputValue}
                    visibility={visibility['regionMoveInDate']} siDo={formData.siDoName} />

                {/* [꼬리질문] 서울, 경기, 인천에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion2 onChangedInputValue={onChangedInputValue}
                    visibility={visibility['metropolitanAreaDate']} type='date' placeholder={placeholderText.dateType} />

                {/* 세대주 여부 */}
                <RadioButtonItem number={4} question={'세대주 여부'}
                    buttons={houseHolderButtons} direction={'horizontal'} onChange={onChangedInputValue} />

                {/* 결혼 여부 */}
                <RadioButtonItem number={5} question={'결혼을 하셨습니까?'}
                    buttons={marriedButtons} direction={'vertical'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 혼인신고일 */}
                <MarriedFollwUpQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['marriedDate']} />

                {/* 다음으로 */}
                <Button variant="dark" onClick={handleClick}>다음</Button>
            </Stack>

        </Form>
    );
}

{/* 거주지역 - 현재 사는 지역 */ }
function MoveInDate({ onChangedInputValue, changeVisibility }) {
    
    const [sidoSelectedName, setSidoSelectedName] = useState('시/도');
    const [gunguSelectedName, setGunguelectedName] = useState('군/구');

    const sidoData = conditions.wishRegion.subcategories;
    const [sidoIndex, setSidoIndex] = useState(0);
    const [gunguData, setGunguData] = useState([{value: '군/구'}]);

    function handleChangedSidoDropdown({index}) {
        setSidoIndex(index);
        setGunguData(sidoData[index].values);
        setSidoSelectedName(sidoData[index].category);
        
        onChangedInputValue({name: 'siDo', value: sidoData[index].code});
        onChangedInputValue({name: 'siDoName', value: sidoData[index].category});

        setGunguelectedName('군/구');
        onChangedInputValue({name: 'gunGu', value: null});

        const sidoCode = sidoData[index].code;

        // 서울, 인천, 경기?
        const trueCondition = sidoCode === 100 || sidoCode === 400 || sidoCode == 410;
        changeVisibility({ condition: trueCondition, name: 'metropolitanAreaDate'});

        // 경기/충북/충남/전북/전남/경북/경남/강원
        const regionMoveinSidoList = [410, 360, 312, 560, 513, 712, 621, 200];
        const regionMoveinCondition = regionMoveinSidoList.includes(sidoCode);
        changeVisibility({ condition: regionMoveinCondition, name: 'regionMoveInDate'});
    }

    function handleChangedGuGunDropdown({index}) {
        
        // 값 저장
        setGunguelectedName(gunguData[index].value);
        onChangedInputValue({name: 'gunGu', value: gunguData[index].value});
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

{/* 거주지역 - 특정 지역()에 거주하기 시작한 날 */ }
function MoveInFollwUpQuestion1({ siDo, onChangedInputValue, visibility }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem number={'3-1'} question={`${siDo}에 거주하기 시작한 날`} depth={3}
            name={'regionMoveInDate'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />
    );
}

{/* 거주지역 - 서울, 경기, 인천에 거주하기 시작한 날 */ }
function MoveInFollwUpQuestion2({ onChangedInputValue, visibility }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem number={'3-2'} question={'서울, 경기, 인천에 거주하기 시작한 날'} depth={3}
            name={'metropolitanAreaDate'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />
    );
}

{/* 결혼 여부 - 혼인신고일 */ }
function MarriedFollwUpQuestion({ onChangedInputValue, visibility }) {

    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'5-1'} question={'혼인신고일'} depth={3}
            name={'marriedDate'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />
    );
}