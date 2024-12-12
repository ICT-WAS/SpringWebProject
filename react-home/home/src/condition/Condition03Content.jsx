import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import { data, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { InputNumberItem, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { CheckButtonItem, CheckButtonSubItem, CheckButtonSubItemWithFollowQuestions } from "./CheckButtonItem";
import { placeholderText } from "./placeholderText";
import { FamilyMember, familyMemberNames, getEnumKeyFromValue, getFamilyMemberName } from "./family.ts";

export default function Condition03Content() {

    const navigate = useNavigate();

    const totalPropertyValueButtons = { name: 'propertyPrice', values: [{ data: '미보유 혹은 2억 1,150만원 이하', value: 0 }, { data: '2억 1,150만원 초과 3억 3,100만원 이하', value: 1 }, { data: '3억 3,100만원 초과', value: 2 }] }
    const incomeActivityTypeButtons = { name: 'incomeActivity', values: [{ data: '외벌이', value: 0 }, { data: '맞벌이', value: 1, hasFollowUpQuestion: true }] }
    const winningHistoryButtons = { name: 'lastWinned', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const wasDisqualifiedButtons = { name: 'ineligible', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }

    /* 제출용 데이터 */
    const [hasSpouse, setHasSpouse] = useState(false);
    const [formData1, setFormData1] = useState({});
    const [formData2, setFormData2] = useState({});
    const [formData, setFormData] = useState({});
    const [familyData, setFamilyData] = useState({});

    const [family, setFamily] = useState([]);

    
    /* 꼬리질문 가시성 */
    const followUpQuestions = {
        hasVehicle: [{ value: 'Y', subQuestionId: 'vehicleValue' }],
        incomeActivity: [{ value: 1, subQuestionId: 'spouseIncome' }],
        lastWinned: [{ value: 'Y', subQuestionId: 'winningDate' }],
        ineligible: [{ value: 'Y', subQuestionId: 'disqualifiedDate' }]
    };
    const [visibility, setVisibility] = useState({ vehicleValue: true, spouseIncome: false, hasHouseInfo: false, soldHouseInfo: false, winningDate: false, disqualifiedDate: false });


    useEffect(() => {
        /* 이전 폼 데이터 읽어오기 */
        const sessionFormData1 = sessionStorage.getItem('formData1');
        const sessionFormData = sessionStorage.getItem('formData2');
        const sessionFamilyData = sessionStorage.getItem('familyData');
        let storedFormData1 = {};
        let storedFormData2 = {};
        let storedFamilyData = {};

        try {
            storedFormData1 = JSON.parse(sessionFormData1);
            storedFormData2 = JSON.parse(sessionFormData);
            storedFamilyData = JSON.parse(sessionFamilyData);

            // 상태 업데이트
            setHasSpouse(storedFormData2.spouse === 'Y');
            setFormData1(storedFormData1);
            setFormData2(storedFormData2);
            setFamilyData(storedFamilyData);

            const familyKeys = Object.keys(storedFamilyData).map(key => Number(key));
            setFamily(familyKeys);
        } catch (error) { }
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

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


    function handlePrevButtonClick(e) {

        navigate("/condition-2");
    }

    function handleNextButtonClick(e) {

        console.log(formData1);
        console.log(formData2);
        console.log(formData);
        console.log(familyData);
        console.log(family);
        // 제출


        // navigate("/condition-3");
        sessionStorage.removeItem('formData3');
        sessionStorage.removeItem('familyData');
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

                {/* 차량가액을 입력해주세요 */}
                {/* 미보유 체크시 0원 */}
                <CheckButtonItem number={3} question={'차량가액을 입력해주세요'}
                    buttons={{ name: 'hasVehicle', values: [{ value: '', data: '차량 미보유', hasFollowUpQuestion: true }] }}
                    onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
                    subQuestion={VehicleValueQuestion} reverseCheck={true} />

                {/* ![꼬리질문] 차량가액 */}
                <VehicleValueQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['vehicleValue']} />

                {/* 소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요 */}
                <RadioButtonItem number={4} question={'소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요'}
                    buttons={totalPropertyValueButtons} onChange={onChangedInputValue} />

                {/* 세대구성원 전원의 총 자산을 입력해주세요 */}
                <InputNumberItem number={5} question={'세대구성원 전원의 총 자산을 입력해주세요'}
                    name={'totalAsset'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                {/* 본인의 총 자산을 입력해주세요 */}
                <InputNumberItem number={6} question={'본인의 총 자산을 입력해주세요'}
                    name={'myAsset'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                {/* 배우자의 총 자산을 입력해주세요 */}
                {hasSpouse === true && (<InputNumberItem number={7} question={'배우자의 총 자산을 입력해주세요'}
                    name={'spouseAsset'} onChange={onChangedInputValue}
                    placeholder={placeholderText.largeMoneyUnitType} />)}

                {/* 세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액 */}
                <InputNumberItem number={8} question={'세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액'}
                    name={'familyAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                {/* 본인의 전년도 월 평균소득을 입력해주세요 */}
                <InputNumberItem number={9} question={'본인의 전년도 월 평균소득을 입력해주세요'}
                    name={'moveInDate'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                {/* 소득활동 여부를 선택해주세요 */}
                {hasSpouse === true && (<RadioButtonItem number={10} question={'소득활동 여부를 선택해주세요'}
                    buttons={incomeActivityTypeButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />)}

                {/* [꼬리질문] 배우자의 월평균소득을 입력해주세요 */}
                <SpouseIncomeQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['spouseIncome']} />

                {/* 소득세 납부 기간 */}
                <InputNumberItem number={11} question={'소득세 납부 기간'}
                    name={'incomeTaxPaymentPeriod'} onChange={onChangedInputValue} placeholder={placeholderText.yearCountType} />

                {/* 신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요? */}
                <RadioButtonItem number={14} question={'신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요?'}
                    buttons={winningHistoryButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 가장 최근에 당첨된 날짜를 입력해주세요 */}
                <WinningDateQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['winningDate']} />

                {/* 신청자 본인이 주택청약에 당첨되고 부적격자 판정을 받은 적 있나요? */}
                <RadioButtonItem number={15} question={'신청자 본인이 주택청약에 당첨되고 부적격자 판정을 받은 적 있나요?'}
                    buttons={wasDisqualifiedButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 부적격자 판정된 날짜가 언제인가요? */}
                <DisqualifiedDate onChangedInputValue={onChangedInputValue} visibility={visibility['disqualifiedDate']} />

                {/* 폼 제출 */}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>
                    <Button variant="dark" onClick={handleNextButtonClick} style={{ flex: '1' }} >등록</Button>
                </Stack>
            </Stack>

        </Form>
    );
}

{/* 차량가액 - 차량가액을 입력해주세요 */ }
function VehicleValueQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'3-1'} question={'차량가액을 입력해주세요'} depth={3}
            name={'carPrice'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
    );
}

{/* 배우자 소득활동 - 배우자의 월평균소득을 입력해주세요 */ }
function SpouseIncomeQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'10-1'} question={'배우자의 월평균소득을 입력해주세요'} depth={3}
            name={'spouseAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />
    );
}

{/* 주택분양권소유 - 주택/분양권을 소유한 세대원을 선택해주세요 */ }
function HasHouseQuestion({ onChangedInputValue, family, handleFollowUpQuestion, visibility }) {

    if (!visibility) {
        return;
    }

    const familyButtons = {
        name: 'hasHouseInfo',
        values: family.map(code => ({
            data: getFamilyMemberName(code),
            value: getEnumKeyFromValue(FamilyMember, code),
            hasFollowUpQuestion: true
        }))
    };

    return (
        <CheckButtonSubItemWithFollowQuestions number={'12-1'} question={'주택/분양권을 소유한 세대원을 선택해주세요'} depth={3}
            buttons={familyButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={HasHouseCountQuestion} />
    );
}

{/* 주택분양권소유 - 소유 주택/분양권 수 */ }
function HasHouseCountQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'12-2'} question={'소유 주택/분양권 수'} depth={4}
            name={'houseCount'} onChange={onChangedInputValue} placeholder={placeholderText.houseCountType} />
    );
}

{/* 주택처분이력 - 주택을 처분한 세대원을 선택해주세요 */ }
function SoldHouseQuestion({ onChangedInputValue, family, handleFollowUpQuestion, visibility }) {

    if (!visibility) {
        return;
    }

    const familyButtons = {
        name: 'soldHouseInfo',
        values: family.map(code => ({
            data: getFamilyMemberName(code),
            value: getEnumKeyFromValue(FamilyMember, code),
            hasFollowUpQuestion: true
        }))
    };

    return (
        <CheckButtonSubItemWithFollowQuestions number={'13-1'} question={'주택을 처분한 세대원을 선택해주세요'} depth={3}
            buttons={familyButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={SoldHouseDateQuestion} />
    );
}

{/* 주택처분이력 - 주택 처분한 날짜 */ }
function SoldHouseDateQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'13-2'} question={'주택 처분한 날짜'} depth={4}
            name={'houseSoldDate'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
    );
}

{/* 당첨이력 - 가장 최근에 당첨된 날짜를 입력해주세요 */ }
function WinningDateQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'14-1'} question={'가장 최근에 당첨된 날짜를 입력해주세요'} depth={3}
            name={'lastWinned'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}

{/* 당첨이력 - 부적격자 판정된 날짜가 언제인가요? */ }
function DisqualifiedDate({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'15-1'} question={'부적격자 판정된 날짜가 언제인가요?'} depth={3}
            name={'ineligible'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}