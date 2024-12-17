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
        birthday: null,
        gunGu: null,
        siDo: null,
        transferDate: null,
        regionMoveInDate: null,
        isHouseHolder: null,
        married: null,
        marriedDate: null
    });

    const [spouseFormData, setSpouseFormData] = useState({
        spouse: null,
        spouseHasAccount: null
    });

    const [accountData, setAccountData] = useState({
        type: null,
        createdAt: null,
        paymentCount: null,
        totalAmount: null,
        recognizedAmount: null
    });

    const [spouseAccountData, setSpouseAccountData] = useState({
        createdAt: null
    });

    // const [formData, setFormData] = useState({
    //     "birthday": "1999-12-10",
    //     "gunGu": "관악구",
    //     "siDo": "100",
    //     "transferDate": "1999-12-10",
    //     "regionMoveInDate": null,
    //     "isHouseHolder": false,
    //     "married": 2,
    //     "marriedDate": null,
    //     "metropolitanAreaDate": "2000-01-01"

    // });

    // const [spouseFormData, setSpouseFormData] = useState({
    //     spouse: null,
    //     spouseHasAccount: null
    // });

    // const [accountData, setAccountData] = useState({
    //     "type": "SAVINGS_ACCOUNT",
    //     "createdAt": "2000-01-01",
    //     "paymentCount": 2,
    //     "totalAmount": 12,
    //     "recognizedAmount": 12,
    //     "relationship": 1

    // });

    // const [spouseAccountData, setSpouseAccountData] = useState({
    //     "createdAt": "1989-01-01",
    //     "relationship": 2

    // });

    

    /* 꼬리질문 가시성 */
    const [hasSpouse, setHasSpouse] = useState(false); // 기혼, 예비신혼부부부

    useEffect(() => {
            /* 이전 폼 데이터 읽어오기 */
            const sessionData = sessionStorage.getItem('formData1');
            const accountData = sessionStorage.getItem('accountDTOList');

            let spouseData = {livingWithSpouse: sessionStorage.getItem('livingWithSpouse')};
            
            if (!sessionData) return;
    
            let userData = null;
            try {
                userData = JSON.parse(sessionData);
                setFormData(userData);
    
                const account = JSON.parse(accountData);
                setAccountData(account[0]);
                if(account.length > 1) {
                    setSpouseAccountData(account[1]);
                    spouseData = {...spouseData, spouseHasAccount: 'Y'};
                }

                setSpouseFormData(spouseData);
                
            } catch (error) { }
    
        }, []);

    useEffect(() => {
        setHasSpouse(formData['married'] === 1 || formData['married'] === 2);
    }, [formData]);

    function onChangedInputValue({ name, value }) {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function onChangedAccount({ name, value }) {
        setAccountData((prev) => ({ ...prev, [name]: value, relationship: 1 }));
    }

    function onSpouseChangedInputValue({ name, value }) {
        setSpouseFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    }

    function onSpouseChangedAccount({ name, value }) {
        setSpouseAccountData({ [name]: value, relationship: 2 });
    }

    function handleSubmit(event) {

        console.log(formData);
        console.log(accountData);
        console.log(spouseAccountData);

        // const form = event.target;
        // if (form.checkValidity() === false) {

        //     alert('모든 항목을 입력해주세요.');
        //     event.preventDefault();
        //     event.stopPropagation();
        //     return;
        // }

        let accountDTOList = { accountDTOList: [{ ...accountData }]};
        if (hasSpouse && spouseAccountData.createdAt) { // (기혼 || 예비신혼) && 배우자 계좌 정보
            accountDTOList = { accountDTOList: [{...accountData,}, {...spouseAccountData}] };
        }

        // 폼 데이터 저장
        sessionStorage.setItem('formData1', JSON.stringify(formData));
        sessionStorage.setItem('accountDTOList', JSON.stringify(accountDTOList));
        sessionStorage.setItem('livingWithSpouse', spouseFormData.spouse);

        console.log(formData);
        console.log(accountDTOList);

        navigate("/condition-2");
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
                    placeholder={placeholderText.dateType} />

                {/* 현재 거주지 */}
                <MoveInDate onChangedInputValue={onChangedInputValue} siDoValue={formData.siDo} gunGuValue={formData.gunGu} />

                {/* 현재 거주지에 입주한 날 */}
                <InputNumberItem question={`${formData.gunGu || 'OOO'}에 입주한 날(주민등록표등본에 있는 전입일자)`}
                    name={'transferDate'} onChange={onChangedInputValue} type='date' 
                    placeholder={placeholderText.dateType} value={formData.transferDate}/>

                {/* [꼬리질문] 현재 지역(시/도)에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion1 onChangedInputValue={onChangedInputValue}
                    siDo={formData.siDo} 
                    value={formData.regionMoveInDate}/>

                {/* [꼬리질문] 서울, 경기, 인천에 거주하기 시작한 날 */}
                <MoveInFollwUpQuestion2 onChangedInputValue={onChangedInputValue}
                    siDo={formData.siDo} type='date' placeholder={placeholderText.dateType}
                      value={formData.metropolitanAreaDate}/>

                {/* 세대주 여부 */}
                <RadioButtonItem question={'세대주 여부'} value={formData.isHouseHolder} 
                    buttons={houseHolderButtons} direction={'horizontal'} onChange={onChangedInputValue} />

                {/* 결혼 여부 */}
                <Married value={formData.married} buttons={marriedButtons} onChange={onChangedInputValue}/>

                {/* [꼬리질문] 혼인신고일 */}
                {formData?.married === 1 && <MarriedFollwUpQuestion onChangedInputValue={onChangedInputValue} 
                value={formData?.marriedDate} />}

                {/* [꼬리질문] 배우자 동거 여부 */}
                {hasSpouse && <RadioButtonSubItem question={'배우자와 같이 살고 계신가요?'} depth={3}
                    buttons={livingWithSpouseButtons} direction={'horizontal'} onChange={onSpouseChangedInputValue}
                    value={spouseFormData.spouse} />}

                {/* 소유하신 청약 통장의 종류를 선택해주세요 */}
                <RadioButtonItem question={'소유하신 청약 통장의 종류를 선택해주세요'}
                    buttons={accountTypeButtons} direction={'horizontal'} 
                    value={accountData?.type}
                    onChange={onChangedAccount} />

                {/* [꼬리질문] 청약 통장 정보 */}
                {accountData?.type !== null && <AccountInfoQuestion onChangedInputValue={onChangedAccount}
                    value={accountData} />}

                {/* 배우자도 청약 통장이 있으신가요? */}
                {hasSpouse && (
                    <RadioButtonSubItem
                        question={'배우자도 청약 통장이 있으신가요?'} depth={3}
                        buttons={spouseHasAccountButtons}
                        direction={'horizontal'}
                        onChange={onSpouseChangedInputValue}
                        value={spouseFormData?.spouseHasAccount}
                    />
                )}
                {/* [꼬리질문] 배우자의 청약 통장 정보 */}
                {(hasSpouse && spouseFormData?.spouseHasAccount === "Y") && 
                <SpouseAccountInfoQuestion onChangedInputValue={onSpouseChangedAccount} 
                    value={spouseAccountData?.createdAt}/>}

                {/* 다음으로 */}
                <Button variant="dark" type="submit" >다음</Button>
            </Stack>

        </Form>
        </>
    );
}

/* 거주지역 - 현재 사는 지역 */
function MoveInDate({ onChangedInputValue, siDoValue, gunGuValue }) {

    const sidoData = conditionInfo.wishRegion.subcategories;
    const [gunguData, setGunguData] = useState([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {

        let nextGunguData = [];
        const compareSidoCode = Number(siDoValue);

        if(compareSidoCode !== Sido.NONE) {
            nextGunguData =  sidoData.find((prev) => prev.code === siDoValue)?.values;

            setGunguData(nextGunguData || []);
        }

        if(!initialized) {
            setInitialized(true);
            return;
        }

        // 경기/충북/충남/전북/전남/경북/경남/강원
        const regionMoveinSidoList = [Sido.경기, Sido.충북, Sido.충남, Sido.전북, Sido.전남, Sido.경북, Sido.경남, Sido.강원];
        const regionMoveinCondition = regionMoveinSidoList.includes(compareSidoCode);
        if(!regionMoveinCondition) {
            onChangedInputValue({ name: 'regionMoveInDate', value: null });
        }

        // 서울/경기/인천
        const matropolitanCondition = compareSidoCode === Sido.서울 || compareSidoCode === Sido.인천 || compareSidoCode === Sido.경기;
        if (!matropolitanCondition) {
            onChangedInputValue({ name: 'metropolitanAreaDate', value: null });
        }

        const findValue = nextGunguData.find((nextGunGu) => nextGunGu.value === gunGuValue);
        if(findValue === null) {
            onChangedInputValue({ name: 'gunGu', value: null });
        }
    
    }, [siDoValue]);

    function handleChangedSido(e) {
        onChangedInputValue({name: 'siDo', value: e.target.value});
    }

    function handleChangedGungu(e) {
        onChangedInputValue({ name: 'gunGu', value: e.target.value });
    }

    const sidoList = () => {
        return sidoData.map((item, index) => (
            <option key={index + 1} value={item.code} >{item.category}</option>
        ));
    }
    const gunguList = () => {
        return gunguData.map((item, index) => (
            <option key={index + 1} value={item.value} >{item.value}</option>
        ));
    }

    return (
        <>
            <div>
                <p className="card-header-text">현재 거주지</p>
                <Stack direction='horizontal' gap={2} >
                    <Form.Select required value={siDoValue || ''} onChange={handleChangedSido}>
                        <option value="" >시/군 선택</option>
                        {sidoList()}
                    </Form.Select>
                    <Form.Select required value={gunGuValue || ''} onChange={handleChangedGungu}>
                        <option value="" >군/구 선택</option>
                        {gunguList()}
                    </Form.Select>
                </Stack>
            </div>

        </>
    );
}

/* 거주지역 - 특정 지역()에 거주하기 시작한 날 */
function MoveInFollwUpQuestion1({ siDo, onChangedInputValue, value }) {

    // 경기/충북/충남/전북/전남/경북/경남/강원
    const compareSidoCode = Number(siDo);
    const regionMoveinSidoList = [Sido.경기, Sido.충북, Sido.충남, Sido.전북, Sido.전남, Sido.경북, Sido.경남, Sido.강원];
    const regionMoveinCondition = regionMoveinSidoList.includes(compareSidoCode);
    if (!regionMoveinCondition) {
        return;
    }

    return (
        <InputNumberSubItem question={`${Sido[siDo]}에 거주하기 시작한 날`} depth={3} 
            value={value}
            name={'regionMoveInDate'} onChange={onChangedInputValue} type='date' placeholder={placeholderText.dateType} />
    );
}

/* 거주지역 - 서울, 경기, 인천에 거주하기 시작한 날 */
function MoveInFollwUpQuestion2({ onChangedInputValue, value, siDo }) {

    const compareSidoCode = Number(siDo);
    const matropolitanCondition = compareSidoCode === Sido.서울 || compareSidoCode === Sido.인천 || compareSidoCode === Sido.경기;
    if (!matropolitanCondition) {
        return;
    }

    return (
        <InputNumberSubItem question={'서울, 경기, 인천에 거주하기 시작한 날'} depth={3}
            value={value}
            name={'metropolitanAreaDate'} onChange={onChangedInputValue} type='date' 
            placeholder={placeholderText.dateType}   />
    );
}

/* 결혼 여부 */
function Married({value, buttons, onChange }) {

    function onChangeValue({ name, value }) {
        onChange({ name, value });
        onChange({ name: 'marriedDate', value: null });
    }

    return(
        <RadioButtonItem question={'결혼을 하셨습니까?'} value={value}
        buttons={buttons} direction={'vertical'} onChange={onChangeValue} />
    );
}

/* 결혼 여부 - 혼인신고일 */
function MarriedFollwUpQuestion({ onChangedInputValue, value }) {

    return (
        <InputNumberSubItem question={'혼인신고일'} depth={3}
            name={'marriedDate'} onChange={onChangedInputValue} type='date' 
            placeholder={placeholderText.dateType}   value={value} />
    );
}

/* 청약 통장 - 청약 통장 정보 */
function AccountInfoQuestion({ onChangedInputValue, value }) {

    return (
        <div>
            <InputNumberSubItem question={'가입일자 입력'} depth={3}   value={value?.createdAt}
                name={'createdAt'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
            <InputNumberSubItem question={'납입 횟수 입력'} depth={3}   value={value?.paymentCount}
                name={'paymentCount'} onChange={onChangedInputValue} placeholder={placeholderText.countType} />
            <InputNumberSubItem question={'총 납입 금액 입력'} depth={3}   value={value?.totalAmount}
                name={'totalAmount'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
            <InputNumberSubItem question={'납입 인정 금액 입력'} depth={3}   value={value?.recognizedAmount}
                name={'recognizedAmount'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
        </div>
    );
}

/* 배우자 청약통장 - 가입일자 */
function SpouseAccountInfoQuestion({ onChangedInputValue, value }) {

    return (
        <InputNumberSubItem question={'가입일자 입력'} depth={3}   value={value}
            name={'createdAt'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}