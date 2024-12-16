import { Button, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputNumberItem, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { conditionInfo } from '../apply_announcement/conditionInfo.js';
import { placeholderText } from "./placeholderText";
import { Sido } from "../common/Enums.ts";

export default function Condition01Content() {

    const navigate = useNavigate();

    const [hasError, setHasError] = useState(false);

    const houseHolderButtons = { name: 'isHouseHolder', values: [{ data: '세대원', value: false, }, { data: '세대주', value: true, }] }
    const marriedButtons = { name: 'married', values: [{ data: '미혼', value: 0 }, { data: '기혼', value: 1, hasFollowUpQuestion: true }, { data: '예비신혼부부', value: 2 }, { data: '한부모', value: 3 }] }
    const accountTypeButtons = {
        name: 'type', values: [
            { data: '청약예금', value: 'SAVINGS_ACCOUNT', hasFollowUpQuestion: true },
            { data: '청약부금', value: 'SAVINGS_PLAN', hasFollowUpQuestion: true },
            { data: '청약저축', value: 'SAVINGS_DEPOSIT', hasFollowUpQuestion: true },
            { data: '주택청약종합저축', value: 'COMBINED_SAVINGS', hasFollowUpQuestion: true }]
    }
    const spouseHasAccountButtons = { name: 'spouseHasAccount', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const livingWithSpouseButtons = { name: 'spouse', values: [{ data: '예', value: 'Y' }, { data: '아니오', value: 'N' }] }

    /* 제출용 데이터 */
    const [formData, setFormData] = useState({
        birthday: 19991210,
        gunGu: "영동군",
        siDo: 360,
        transferDate: 19991210,
        regionMoveInDate: 19991208,
        isHouseHolder: false,
        married: 1,
        marriedDate: 19991210

    });
    const [spouseFormData, setSpouseFormData] = useState({});
    const [accountData, setAccountData] = useState({});
    const [spouseAccountData, setSpouseAccountData] = useState({});

    /* 꼬리질문 가시성 */
    const [hasSpouse, setHasSpouse] = useState(false);
    const followUpQuestions = {
        married: [{ value: 1, subQuestionId: 'marriedDate' }],
        moveInDate: [{ value: 1, subQuestionId: 'metropolitanAreaDate' }, { value: 2, subQuestionId: 'regionMoveInDate' }],
        type: [{ value: 'SAVINGS_ACCOUNT', subQuestionId: 'accountInfo' },
        { value: 'SAVINGS_PLAN', subQuestionId: 'accountInfo' },
        { value: 'SAVINGS_DEPOSIT', subQuestionId: 'accountInfo' },
        { value: 'COMBINED_SAVINGS', subQuestionId: 'accountInfo' }],
        spouseHasAccount: [{ value: 'Y', subQuestionId: 'spouseAccountDate' }],
    };

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
        setHasSpouse(formData['married'] === 1 || formData['married'] === 2);
    }, [formData]);

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

    function onChangedAccount({ name, value }) {
        setAccountData((prev) => ({ ...prev, [name]: value, relationship: 1 }));
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

    function onSpouseChangedAccount({ name, value }) {
        setSpouseAccountData({ [name]: value, relationship: 2 });
    }

    function changeVisibility({ condition, name }) {
        setVisibility((prev) => {
            if (condition) {
                return { ...prev, [name]: true };
            } else {
                return { ...prev, [name]: false };
            }
        });
        setFormData((prev) => {
            if (condition) {
                return prev;
            } else {
                const { [name]: _, ...rest } = prev;
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

    function handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false || hasError) {
            event.preventDefault();
            event.stopPropagation();
            return;
        } 

        let accountDTOList = { accountDTOList: [{ ...accountData }]};
        if (hasSpouse && spouseAccountData.createdAt) {
            accountDTOList = { accountDTOList: [{...accountData,}, {...spouseAccountData}] };
        }

        // 폼 데이터 저장
        sessionStorage.setItem('formData1', JSON.stringify(formData));
        sessionStorage.setItem('accountDTOList', JSON.stringify(accountDTOList));
        sessionStorage.setItem('livingWithSpouse', spouseFormData.spouse);

        navigate("/condition-2");
    }

    function setError(error) {
        setHasError((err) => err & error);
    }

    return (
        <>
        <p className='heading-text'>
          조건 등록 (1/3) - 신청자/배우자 정보 입력
        </p>

        <Form noValidate onSubmit={handleSubmit}>
            <Stack direction='vertical' gap={5} >

                {/* 신청자 생년월일 */}
                <InputNumberItem question={'신청자 생년월일'}
                    name={'birthday'} onChange={onChangedInputValue} type='date' value={formData.birthday}
                    placeholder={placeholderText.dateType} hasError={setError}/>

                {/* 현재 거주지 */}
                <MoveInDate onChangedInputValue={onChangedInputValue} changeVisibility={changeVisibility} siDoValue={formData.siDo} gunGuValue={formData.gunGu} />

                {/* 현재 거주지에 입주한 날 */}
                <InputNumberItem question={`${formData.gunGu ?? 'OOO'}에 입주한 날(주민등록표등본에 있는 전입일자)`}
                    name={'transferDate'} onChange={onChangedInputValue} type='date' 
                    placeholder={placeholderText.dateType} hasError={setError} value={formData.transferDate}/>

                {/* [꼬리질문] 현재 지역(시/도)에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion1 onChangedInputValue={onChangedInputValue}
                    visibility={visibility['regionMoveInDate']} siDo={Sido[formData.siDo]} setError={setError}
                    value={formData.regionMoveInDate}/>

                {/* [꼬리질문] 서울, 경기, 인천에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion2 onChangedInputValue={onChangedInputValue}
                    visibility={visibility['metropolitanAreaDate']} type='date' placeholder={placeholderText.dateType}
                     setError={setError} value={formData.metropolitanAreaDate}/>

                {/* 세대주 여부 */}
                <RadioButtonItem question={'세대주 여부'} value={formData.isHouseHolder}
                    buttons={houseHolderButtons} direction={'horizontal'} onChange={onChangedInputValue} />

                {/* 결혼 여부 */}
                <RadioButtonItem question={'결혼을 하셨습니까?'} value={formData.married}
                    buttons={marriedButtons} direction={'vertical'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 혼인신고일 */}
                <MarriedFollwUpQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['marriedDate']} 
                setError={setError} value={formData.marriedDate} />

                {/* [꼬리질문] 배우자 동거 여부 */}
                {hasSpouse && <RadioButtonSubItem question={'배우자와 같이 살고 계신가요?'} depth={3}
                    buttons={livingWithSpouseButtons} direction={'horizontal'} onChange={onSpouseChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />}

                {/* 소유하신 청약 통장의 종류를 선택해주세요 */}
                <RadioButtonItem question={'소유하신 청약 통장의 종류를 선택해주세요'}
                    buttons={accountTypeButtons} direction={'horizontal'} onChange={onChangedAccount}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 청약 통장 정보 */}
                <AccountInfoQuestion onChangedInputValue={onChangedAccount} visibility={visibility['accountInfo']} setError={setError}/>

                {/* 배우자도 청약 통장이 있으신가요? */}
                {hasSpouse && (
                    <RadioButtonSubItem
                        question={'배우자도 청약 통장이 있으신가요?'} depth={3}
                        buttons={spouseHasAccountButtons}
                        direction={'horizontal'}
                        onChange={onSpouseChangedInputValue}
                        handleFollowUpQuestion={handleFollowUpQuestion}
                    />
                )}
                {/* [꼬리질문] 배우자의 청약 통장 정보 */}
                {(visibility['spouseAccountDate'] && hasSpouse) && 
                <SpouseAccountInfoQuestion onChangedInputValue={onSpouseChangedAccount} setError={setError}/>}

                {/* 다음으로 */}
                <Button variant="dark" type="submit" >다음</Button>
            </Stack>

        </Form>
        </>
    );
}

/* 거주지역 - 현재 사는 지역 */
function MoveInDate({ onChangedInputValue, changeVisibility, siDoValue, gunGuValue }) {

    const [gunguSelectedName, setGunguelectedName] = useState('군/구');

    const [sidoSelectedIndex, setSidoSelectedIndex] = useState("");
    const [gunguSelectedIndex, setGunguSelectedIndex] = useState("");

    const sidoData = conditionInfo.wishRegion.subcategories;
    const [gunguData, setGunguData] = useState([]);

    function handleChangedSido(e) {

        const index = Number(e.target.value);
        setSidoSelectedIndex(index);

        setGunguSelectedIndex("");
        onChangedInputValue({ name: 'gunGu', value: null });

        let nextGunguData = [];
        let nextSidoData = { name: 'siDo', value: null };
        let sidoCode = 0;
        if(index > 0) {
            nextGunguData = sidoData[index - 1].values;
            nextSidoData = { name: 'siDo', value: sidoData[index - 1].code };
            sidoCode = sidoData[index - 1].code;
        } 

        setGunguData(nextGunguData);
        onChangedInputValue(nextSidoData);

        // 서울, 인천, 경기?
        const trueCondition = sidoCode === 100 || sidoCode === 400 || sidoCode === 410;
        changeVisibility({ condition: trueCondition, name: 'metropolitanAreaDate' });

        // 경기/충북/충남/전북/전남/경북/경남/강원
        const regionMoveinSidoList = [410, 360, 312, 560, 513, 712, 621, 200];
        const regionMoveinCondition = regionMoveinSidoList.includes(sidoCode);
        changeVisibility({ condition: regionMoveinCondition, name: 'regionMoveInDate' });
    }

    function handleChangedGungu(e) {

        const index = Number(e.target.value);
        setGunguSelectedIndex(index);

        // 값 저장
        setGunguelectedName(gunguData[index - 1].value);
        onChangedInputValue({ name: 'gunGu', value: gunguData[index - 1].value });
    }

    const sidoList = () => {
        return sidoData.map((item, index) => (
            <option key={index + 1} value={index + 1} >{item.category}</option>
        ));
    }
    const gunguList = () => {
        return gunguData.map((item, index) => (
            <option key={index + 1} value={index + 1} >{item.value}</option>
        ));
    }

    return (
        <>
            <div>
                <p className="card-header-text">현재 거주지</p>
                <Stack direction='horizontal' gap={2} >
                    <Form.Select required value={sidoSelectedIndex} onChange={handleChangedSido}>
                        <option value="" >시/군 선택</option>
                        {sidoList()}
                    </Form.Select>
                    <Form.Select required value={gunguSelectedIndex} onChange={handleChangedGungu}>
                        <option value="" >군/구 선택</option>
                        {gunguList()}
                    </Form.Select>
                </Stack>
            </div>

        </>
    );
}

/* 거주지역 - 특정 지역()에 거주하기 시작한 날 */
function MoveInFollwUpQuestion1({ siDo, onChangedInputValue, visibility, setError }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem question={`${siDo}에 거주하기 시작한 날`} depth={3} hasError={setError}
            name={'regionMoveInDate'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />
    );
}

/* 거주지역 - 서울, 경기, 인천에 거주하기 시작한 날 */
function MoveInFollwUpQuestion2({ onChangedInputValue, visibility, setError }) {

    if (visibility === false) {
        return;
    }

    return (
        <InputNumberSubItem question={'서울, 경기, 인천에 거주하기 시작한 날'} depth={3}
            name={'metropolitanAreaDate'} onChange={onChangedInputValue} type='date' 
            placeholder={placeholderText.dateType} hasError={setError} />
    );
}

/* 결혼 여부 - 혼인신고일 */
function MarriedFollwUpQuestion({ onChangedInputValue, visibility, setError }) {

    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem question={'혼인신고일'} depth={3}
            name={'marriedDate'} onChange={onChangedInputValue} type='date' 
            placeholder={placeholderText.dateType} hasError={setError}/>
    );
}

/* 청약 통장 - 청약 통장 정보 */
function AccountInfoQuestion({ onChangedInputValue, visibility, setError }) {

    if (!visibility) {
        return;
    }

    return (
        <div>
            <InputNumberSubItem question={'가입일자 입력'} depth={3} hasError={setError}
                name={'createdAt'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
            <InputNumberSubItem question={'납입 횟수 입력'} depth={3} hasError={setError}
                name={'paymentCount'} onChange={onChangedInputValue} placeholder={placeholderText.countType} />
            <InputNumberSubItem question={'총 납입 금액 입력'} depth={3} hasError={setError}
                name={'totalAmount'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
            <InputNumberSubItem question={'납입 인정 금액 입력'} depth={3} hasError={setError}
                name={'recognizedAmount'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
        </div>
    );
}

/* 배우자 청약통장 - 가입일자 */
function SpouseAccountInfoQuestion({ onChangedInputValue, setError }) {

    return (
        <InputNumberSubItem question={'가입일자 입력'} depth={3} hasError={setError}
            name={'createdAt'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}