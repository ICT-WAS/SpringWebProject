import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { InputNumberItem, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { CheckButtonItem, CheckButtonSubItem, CheckButtonSubItemWithFollowQuestions } from "./CheckButtonItem";
import { placeholderText } from "./placeholderText";

export default function Condition03Content() {

    const navigate = useNavigate();

    /*
    SAVINGS_ACCOUNT("청약통장"),
    SAVINGS_PLAN("청약부금"),
    SAVINGS_DEPOSIT("청약저축"),
    COMBINED_SAVINGS("주택청약종합저축");
    */

    const accountTypeButtons = { name: 'accountType', values: [{ value: '청약통장', hasFollowUpQuestion: true }, { value: '청약부금', hasFollowUpQuestion: true }, { value: '청약저축', hasFollowUpQuestion: true }, { value: '주택청약종합저축', hasFollowUpQuestion: true }] }
    const spouseHasAccountButtons = { name: 'spouseHasAccount', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
    const totalPropertyValueButtons = { name: 'totalPropertyValue', values: [{ value: '미보유 혹은 2억 1,150만원 이하' }, { value: '2억 1,150만원 초과 3억 3,100만원 이하' }, { value: '3억 3,100만원 초과' }] }
    const incomeActivityTypeButtons = { name: 'incomeActivityType', values: [{ value: '외벌이' }, { value: '맞벌이', hasFollowUpQuestion: true }] }
    const familyHasHouseButtons = { name: 'familyHasHouse', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
    const soldHouseHistoryButtons = { name: 'soldHouseHistory', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
    const winningHistoryButtons = { name: 'winningHistory', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
    const wasDisqualifiedButtons = { name: 'wasDisqualified', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
    
    const hasSpouse = true;
    const family = ['본인', '배우자', '본인의 증조 할아버지', '본인의 증조 할머니', '본인의 할아버지', '본인의 할머니', '본인의 아버지', '본인의 어머니', '사위 또는 며느리'];

    /* 제출용 데이터 */
    const [formData, setFormData] = useState({});

    /* 꼬리질문 가시성 */
    const followUpQuestions = { accountType: 'accountInfo', spouseHasAccount: 'spouseAccountDate', hasVehicle: 'vehicleValue', incomeActivityType: 'spouseIncome', familyHasHouse: 'hasHouseInfo', soldHouseHistory: 'soldHouseInfo', winningHistory: 'winningDate', wasDisqualified: 'disqualifiedDate' };
    const [visibility, setVisibility] = useState({ accountInfo: false, spouseAccountDate: false, vehicleValue: true, spouseIncome: false, hasHouseInfo: false, soldHouseInfo: false, winningDate: false, disqualifiedDate: false });


    function handlePrevButtonClick(e) {

        console.log(formData);

        navigate("/condition-2");
    }

    function handleNextButtonClick(e) {

        console.log(formData);

        // navigate("/condition-3");
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

                {/* 소유하신 청약 통장의 종류를 선택해주세요 */}
                <RadioButtonItem number={1} question={'소유하신 청약 통장의 종류를 선택해주세요'}
                    buttons={accountTypeButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 청약 통장 정보 */}
                <AccountInfoQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['accountInfo']} />

                {/* 배우자도 청약 통장이 있으신가요? */}
                <RadioButtonItem number={2} question={'배우자도 청약 통장이 있으신가요?'}
                    buttons={spouseHasAccountButtons} direction={'horizontal'} 
                    onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 배우자의 청약 통장 정보 */}
                <SpouseAccountInfoQuestion onChangedInputValue={onChangedInputValue}  visibility={visibility['spouseAccountDate']} />

                {/* 차량가액을 입력해주세요 */}
                <CheckButtonItem number={3} question={'차량가액을 입력해주세요'}
                    buttons={{name: 'hasVehicle', values:[{value: '차량 미보유', hasFollowUpQuestion: true }]}} 
                    onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion} 
                    subQuestion={VehicleValueQuestion} reverseCheck={true} />

                {/* ![꼬리질문] 차량가액 */}
                <VehicleValueQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['vehicleValue']} />

                {/* 소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요 */}
                <RadioButtonItem number={4} question={'소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요'}
                    buttons={totalPropertyValueButtons} onChange={onChangedInputValue} />

                {/* 세대구성원 전원의 총 자산을 입력해주세요 */}
                <InputNumberItem number={5} question={'세대구성원 전원의 총 자산을 입력해주세요'} 
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
                
                {/* 본인의 총 자산을 입력해주세요 */}
                <InputNumberItem number={6} question={'본인의 총 자산을 입력해주세요'} 
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                {/* 배우자의 총 자산을 입력해주세요 */}
                <InputNumberItem number={7} question={'배우자의 총 자산을 입력해주세요'} 
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                {/* 세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액 */}
                <InputNumberItem number={8} question={'세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액'} 
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                {/* 본인의 전년도 월 평균소득을 입력해주세요 */}
                <InputNumberItem number={9} question={'본인의 전년도 월 평균소득을 입력해주세요'} 
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                {/* 소득활동 여부를 선택해주세요 */}
                <RadioButtonItem number={10} question={'소득활동 여부를 선택해주세요'}
                    buttons={incomeActivityTypeButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 배우자의 월평균소득을 입력해주세요 */}
                <SpouseIncomeQuestion onChangedInputValue={onChangedInputValue}  visibility={visibility['spouseIncome']} />

                {/* 소득세 납부 기간 */}
                <InputNumberItem number={11} question={'소득세 납부 기간'} 
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.yearCountType}/>

                {/* 신청자 및 세대구성원이 주택 혹은 분양권을 소유하고 있나요? */}
                <RadioButtonItem number={12} question={'신청자 및 세대구성원이 주택 혹은 분양권을 소유하고 있나요?'}
                    buttons={familyHasHouseButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 주택 처분 세대원, 날짜 */}
                <HasHouseQuestion onChangedInputValue={onChangedInputValue} family={family} 
                    handleFollowUpQuestion={handleFollowUpQuestion} visibility={visibility['hasHouseInfo']} />

                {/* 과거 신청자 및 세대구성원이 주택을 처분한 적 있나요? */}
                <RadioButtonItem number={13} question={'과거 신청자 및 세대구성원이 주택을 처분한 적 있나요?'}
                    buttons={soldHouseHistoryButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 주택 처분 세대원, 날짜 */}
                <SoldHouseQuestion onChangedInputValue={onChangedInputValue} family={family} 
                    handleFollowUpQuestion={handleFollowUpQuestion} visibility={visibility['soldHouseInfo']} />

                {/* 신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요? */}
                <RadioButtonItem number={14} question={'신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요?'}
                    buttons={winningHistoryButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 가장 최근에 당첨된 날짜를 입력해주세요 */}
                <WinningDateQuestion onChangedInputValue={onChangedInputValue}  visibility={visibility['winningDate']} />
                
                {/* 신청자 본인이 주택청약에 당첨되고 부적격자 판정을 받은 적 있나요? */}
                <RadioButtonItem number={15} question={'신청자 본인이 주택청약에 당첨되고 부적격자 판정을 받은 적 있나요?'}
                    buttons={wasDisqualifiedButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 부적격자 판정된 날짜가 언제인가요? */}
                <DisqualifiedDate onChangedInputValue={onChangedInputValue}  visibility={visibility['disqualifiedDate']} />

                {/* 폼 제출 */}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>
                    <Button variant="dark" onClick={handleNextButtonClick} style={{ flex: '1' }} >등록</Button>
                </Stack>
            </Stack>

        </Form>
    );
}

{/* 청약 통장 - 청약 통장 정보 */}
function AccountInfoQuestion({ onChangedInputValue, visibility }) {

    if(!visibility) {
        return ;
    }

    return (
        <div>
            <InputNumberSubItem number={'1-1'} question={'가입일자 입력'} depth={3}
                name={'familyBirth'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
            <InputNumberSubItem number={'1-2'} question={'납입 횟수 입력'} depth={3}
                name={'familyBirth'} onChange={onChangedInputValue} placeholder={placeholderText.countType} />
            <InputNumberSubItem number={'1-3'} question={'총 납입 금액 입력'} depth={3}
                name={'familyBirth'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
            <InputNumberSubItem number={'1-4'} question={'납입 인정 금액 입력'} depth={3}
                name={'familyBirth'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType}/>
        </div>
    );
}

{/* 배우자 청약통장 - 가입일자 */}
function SpouseAccountInfoQuestion({ onChangedInputValue, visibility }) {

    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'2-1'} question={'가입일자 입력'} depth={3}
                name={'spouseAccountDate'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
    );
}

{/* 차량가액 - 차량가액을 입력해주세요 */}
function VehicleValueQuestion({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'3-1'} question={'차량가액을 입력해주세요'} depth={3}
                name={'vehicleValue'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType}/>
    );
}

{/* 배우자 소득활동 - 배우자의 월평균소득을 입력해주세요 */}
function SpouseIncomeQuestion({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'10-1'} question={'배우자의 월평균소득을 입력해주세요'} depth={3}
                name={'spouseIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType}/>
    );
}

{/* 주택분양권소유 - 주택/분양권을 소유한 세대원을 선택해주세요 */}
function HasHouseQuestion({ onChangedInputValue, family, handleFollowUpQuestion, visibility }) {

    if(!visibility) {
        return ;
    }

    const familyButtons = {
        name: 'hasHouseInfo',
        values: family.map(member => ({
            value: member,
            hasFollowUpQuestion: true
        }))
    };

    return (
        <CheckButtonSubItemWithFollowQuestions number={'12-1'} question={'주택/분양권을 소유한 세대원을 선택해주세요'} depth={3}
            buttons={familyButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={HasHouseCountQuestion} />
    );
}

{/* 주택분양권소유 - 소유 주택/분양권 수 */}
function HasHouseCountQuestion({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'12-2'} question={'소유 주택/분양권 수'} depth={4}
            name={'hasHouseCount'} onChange={onChangedInputValue} placeholder={placeholderText.houseCountType} />
    );
}

{/* 주택처분이력 - 주택을 처분한 세대원을 선택해주세요 */}
function SoldHouseQuestion({ onChangedInputValue, family, handleFollowUpQuestion, visibility }) {

    if(!visibility) {
        return ;
    }

    const familyButtons = {
        name: 'soldHouseInfo',
        values: family.map(member => ({
            value: member,
            hasFollowUpQuestion: true
        }))
    };

    return (
        <CheckButtonSubItemWithFollowQuestions number={'13-1'} question={'주택을 처분한 세대원을 선택해주세요'} depth={3}
            buttons={familyButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={SoldHouseDateQuestion} />
    );
}

{/* 주택처분이력 - 주택 처분한 날짜 */}
function SoldHouseDateQuestion({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'13-2'} question={'주택 처분한 날짜'} depth={4}
            name={'soldHouseDate'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
    );
}

{/* 당첨이력 - 가장 최근에 당첨된 날짜를 입력해주세요 */}
function WinningDateQuestion({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'14-1'} question={'가장 최근에 당첨된 날짜를 입력해주세요'} depth={3}
                name={'winningDate'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
    );
}

{/* 당첨이력 - 부적격자 판정된 날짜가 언제인가요? */}
function DisqualifiedDate({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <InputNumberSubItem number={'15-1'} question={'부적격자 판정된 날짜가 언제인가요?'} depth={3}
                name={'disqualifiedDate'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
    );
}