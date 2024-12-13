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
    const accountTypeButtons = {
        name: 'type', values: [
            { data: '청약예금', value: 'SAVINGS_ACCOUNT', hasFollowUpQuestion: true },
            { data: '청약부금', value: 'SAVINGS_PLAN', hasFollowUpQuestion: true },
            { data: '청약저축', value: 'SAVINGS_DEPOSIT', hasFollowUpQuestion: true },
            { data: '주택청약종합저축', value: 'COMBINED_SAVINGS', hasFollowUpQuestion: true }]
    }
    const spouseHasAccountButtons = { name: 'spouseHasAccount', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const livingWithSpouseButtons = { name: 'spouse', values: [{ data: '예', value: 'Y' }, { data: '아니오', value: 'N'}] }

    /* 제출용 데이터 */
    const [formData, setFormData] = useState({});
    const [spouseFormData, setSpouseFormData] = useState({});

    /* 꼬리질문 가시성 */
    const [hasSpouse, setHasSpouse] = useState(false);
    const followUpQuestions = { 
        married: [{value: 1, subQuestionId: 'marriedDate'}], 
        moveInDate: [{value: 1, subQuestionId: 'metropolitanAreaDate'}, {value: 2, subQuestionId: 'regionMoveInDate'}],
        type: [{ value: 'SAVINGS_ACCOUNT', subQuestionId: 'accountInfo' },
            { value: 'SAVINGS_PLAN', subQuestionId: 'accountInfo' },
            { value: 'SAVINGS_DEPOSIT', subQuestionId: 'accountInfo' },
            { value: 'COMBINED_SAVINGS', subQuestionId: 'accountInfo' }],
        spouseHasAccount: [{ value: 'Y', subQuestionId: 'spouseAccountDate' }], };

    const [visibility, setVisibility] = useState({ 
        marriedDate: false, metropolitanAreaDate: false, regionMoveInDate: false,
        accountInfo: false, spouseAccountDate: false, 
     });

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

    useEffect(() => {
        setHasSpouse(formData['married'] === 1 || formData['married'] === 2 );
    }, [formData]);

    function handleClick(e) {

        let formData1 = formData;
        if(hasSpouse) {
            formData1 = {...formData1, ...spouseFormData};
        }

        // 폼 데이터 저장
        sessionStorage.setItem('formData1', JSON.stringify(formData1));
        // console.log(formData1);

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

    function onSpouseChangedInputValue({ name, value }) {
        const questionName = followUpQuestions[name];

        setSpouseFormData(prevFormData => {
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

            setVisibility((prevVisibility) => ({
                ...prevVisibility,
                [questionName]: visible,
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

                {/* [꼬리질문] 배우자 동거 여부 */}
                {hasSpouse && <RadioButtonSubItem number={5} question={'배우자와 같이 살고 계신가요?'} depth={3}
                    buttons={livingWithSpouseButtons} direction={'horizontal'} onChange={onSpouseChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />}
                
                {/* 소유하신 청약 통장의 종류를 선택해주세요 */}
                <RadioButtonItem number={6} question={'소유하신 청약 통장의 종류를 선택해주세요'}
                    buttons={accountTypeButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 청약 통장 정보 */}
                <AccountInfoQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['accountInfo']} />

                {/* 배우자도 청약 통장이 있으신가요? */}
                {hasSpouse && (
                    <RadioButtonSubItem
                        number={2}
                        question={'배우자도 청약 통장이 있으신가요?'} depth={3}
                        buttons={spouseHasAccountButtons}
                        direction={'horizontal'}
                        onChange={onSpouseChangedInputValue}
                        handleFollowUpQuestion={handleFollowUpQuestion}
                    />
                )}
                {/* [꼬리질문] 배우자의 청약 통장 정보 */}
                {(visibility['spouseAccountDate'] && hasSpouse) && <SpouseAccountInfoQuestion onChangedInputValue={onSpouseChangedInputValue} />}

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

{/* 청약 통장 - 청약 통장 정보 */ }
function AccountInfoQuestion({ onChangedInputValue, visibility }) {

    if (!visibility) {
        return;
    }

    return (
        <div>
            <InputNumberSubItem number={'1-1'} question={'가입일자 입력'} depth={3}
                name={'createdAt'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
            <InputNumberSubItem number={'1-2'} question={'납입 횟수 입력'} depth={3}
                name={'paymentCount'} onChange={onChangedInputValue} placeholder={placeholderText.countType} />
            <InputNumberSubItem number={'1-3'} question={'총 납입 금액 입력'} depth={3}
                name={'totalAmount'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
            <InputNumberSubItem number={'1-4'} question={'납입 인정 금액 입력'} depth={3}
                name={'recognizedAmount'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
        </div>
    );
}

{/* 배우자 청약통장 - 가입일자 */ }
function SpouseAccountInfoQuestion({ onChangedInputValue }) {

    return (
        <InputNumberSubItem number={'2-1'} question={'가입일자 입력'} depth={3}
            name={'spouseAccountDate'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}