import axios from 'axios';
import { Button, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { InputNumberItem, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem } from "./RadioButtonItem";
import { placeholderText } from "./placeholderText";
import Spinners from '../common/Spinners';
import { getUserIdFromToken } from '../api/TokenUtils';

export default function Condition03Content() {

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);

    const totalPropertyValueButtons = { name: 'propertyPrice', values: [{ data: '미보유 혹은 2억 1,150만원 이하', value: 0 }, { data: '2억 1,150만원 초과 3억 3,100만원 이하', value: 1 }, { data: '3억 3,100만원 초과', value: 2 }] }
    const incomeActivityTypeButtons = { name: 'incomeActivity', values: [{ data: '외벌이', value: 0 }, { data: '맞벌이', value: 1, hasFollowUpQuestion: true }] }
    const winningHistoryButtons = { name: 'lastWinned', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: null }] }
    const wasDisqualifiedButtons = { name: 'ineligible', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: null }] }

    /* 제출용 데이터 */
    const [formData1, setFormData1] = useState({});
    const [accountDTOList, setAccountDTOList] = useState({});
    const [formData3, setFormData3] = useState({});
    const [spouseAverageMonthlyIncome, setSpouseAverageMonthlyIncome] = useState({});
    const [familyDataList, setFamilyDataList] = useState([]);

    const [hasSpouse, setHasSpouse] = useState(false);

    /* 꼬리질문 가시성 */
    const followUpQuestions = {
        hasVehicle: [{ value: '0', subQuestionId: 'vehicleValue' }],
        incomeActivity: [{ value: 1, subQuestionId: 'spouseIncome' }],
        lastWinned: [{ value: 'Y', subQuestionId: 'winningDate' }],
        ineligible: [{ value: 'Y', subQuestionId: 'disqualifiedDate' }]
    };
    const [visibility, setVisibility] = useState({ vehicleValue: true, spouseIncome: false, hasHouseInfo: false, soldHouseInfo: false, winningDate: false, disqualifiedDate: false });


    useEffect(() => {
        /* 이전 폼 데이터 읽어오기 */
        const sessionFormData1 = sessionStorage.getItem('formData1');
        const sessionAccountData = sessionStorage.getItem('accountDTOList');
        const sessionFamilyData = sessionStorage.getItem('familyDataList');
        const sessionHasSpouse = sessionStorage.getItem('hasSpouse') === 'true';
        let storedFormData1 = {};
        let storedAccountData = {};
        let storedFamilyData = {};

        try {
            storedFormData1 = JSON.parse(sessionFormData1);
            storedAccountData = JSON.parse(sessionAccountData);
            storedFamilyData = JSON.parse(sessionFamilyData);

            // 상태 업데이트
            setHasSpouse(sessionHasSpouse);
            setFormData1(storedFormData1);
            setAccountDTOList(storedAccountData);
            setFamilyDataList(storedFamilyData);
        } catch (error) { }
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

    useEffect(() => {
        const keysToRemove = Object.keys(visibility).filter(
            (key) => visibility[key] === false
        );

        if (keysToRemove.length > 0) {
            setFormData3((prev) => {
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

    {/* 폼 제출 */ }
    function handleSubmit(event) {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {

            setValidated(true);
            return;
        }

        let finalFormData3 = formData3;
        if (formData3.incomeActivity === 1) {
            finalFormData3 = { ...finalFormData3, ...spouseAverageMonthlyIncome };
        }

        const submitData = { condition01DTO: formData1, ...accountDTOList, condition03DTO: finalFormData3, familyDTOList: familyDataList };

        console.log(submitData);


        const token = localStorage.getItem("accessToken");
        const userId = getUserIdFromToken(token);

        // POST 요청
        
        setLoading(true);
        axios
            .post(`http://localhost:8989/condition/${userId}`,submitData)
            .then((response) => {
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 저장 실패:", error);
                setLoading(false);
            });
    };

    function onChangedInputValue({ name, value }) {
        const questionName = followUpQuestions[name];

        setFormData3(prevFormData => {
            const { [questionName]: _, ...filteredData } = prevFormData;

            return {
                ...filteredData,
                [name]: value
            };
        });
    }

    function onChangedSpouseMonthlyIncomValue({ name, value }) {
        setSpouseAverageMonthlyIncome({ [name]: value });
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
        <>
            <p className='heading-text'>
                조건 등록 (3/3) - 재산 정보 입력
            </p>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Stack direction='vertical' gap={5} >

                    {/* 차량가액을 입력해주세요 */}
                    {/* 미보유 체크시 0원 */}
                    <HasVehicle handleFollowUpQuestion={handleFollowUpQuestion} onChangedInputValue={onChangedInputValue} />

                    {/* ![꼬리질문] 차량가액 */}
                    <VehicleValueQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['vehicleValue']} />

                    {/* 소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요 */}
                    <RadioButtonItem question={'소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요'}
                        buttons={totalPropertyValueButtons} onChange={onChangedInputValue} />

                    {/* 세대구성원 전원의 총 자산을 입력해주세요 */}
                    <InputNumberItem question={'세대구성원 전원의 총 자산을 입력해주세요'}
                        name={'totalAsset'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                    {/* 본인의 총 자산을 입력해주세요 */}
                    <InputNumberItem question={'본인의 총 자산을 입력해주세요'}
                        name={'myAsset'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                    {/* 배우자의 총 자산을 입력해주세요 */}
                    {hasSpouse === true && (<InputNumberItem question={'배우자의 총 자산을 입력해주세요'}
                        name={'spouseAsset'} onChange={onChangedInputValue}
                        placeholder={placeholderText.largeMoneyUnitType} />)}

                    {/* 세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액 */}
                    <InputNumberItem question={'세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액'}
                        name={'familyAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                    {/* 본인의 전년도 월 평균소득을 입력해주세요 */}
                    <InputNumberItem question={'본인의 전년도 월 평균소득을 입력해주세요'}
                        name={'previousYearAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                    {/* 소득활동 여부를 선택해주세요 */}
                    {hasSpouse === true && <RadioButtonItem question={'소득활동 여부를 선택해주세요'}
                        buttons={incomeActivityTypeButtons} direction={'horizontal'} onChange={onChangedInputValue}
                        handleFollowUpQuestion={handleFollowUpQuestion} />}

                    {/* [꼬리질문] 배우자의 월평균소득을 입력해주세요 */}
                    <SpouseIncomeQuestion onChangedInputValue={onChangedSpouseMonthlyIncomValue} visibility={visibility['spouseIncome']} />

                    {/* 소득세 납부 기간 */}
                    <InputNumberItem question={'소득세 납부 기간'}
                        name={'incomeTaxPaymentPeriod'} onChange={onChangedInputValue} placeholder={placeholderText.yearCountType} />

                    {/* 신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요? */}
                    <RadioButtonItem question={'신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요?'}
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
                        <Button variant="dark" type="submit" style={{ flex: '1' }} >등록</Button>
                    </Stack>
                </Stack>

            </Form>
            {loading && <Spinners />}
        </>
    );
}

function HasVehicle({ handleFollowUpQuestion, onChangedInputValue }) {

    function handleCheckChange(e) {

        let checked = e.target.checked;

        if (checked) {
            onChangedInputValue({ name: 'carPrice', value: 0 });
        }

        handleFollowUpQuestion({ name: 'hasVehicle', visible: (!checked) });
    }

    return (
        <>
            <div>
                <p className="card-header-text">{'차량가액을 입력해주세요'}</p>
                <Form.Check
                    type={'checkbox'}
                    name={'hasVehicle'}
                    label={'차량 미보유'}
                    id={'hasVehicle'}
                    style={{ flex: `1` }}
                    onChange={handleCheckChange}
                />
            </div>
        </>
    );
}

{/* 차량가액 - 차량가액을 입력해주세요 */ }
function VehicleValueQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem question={'차량가액을 입력해주세요'} depth={3}
            name={'carPrice'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
    );
}

{/* 배우자 소득활동 - 배우자의 월평균소득을 입력해주세요 */ }
function SpouseIncomeQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem question={'배우자의 월평균소득을 입력해주세요'} depth={3}
            name={'spouseAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />
    );
}

{/* 당첨이력 - 가장 최근에 당첨된 날짜를 입력해주세요 */ }
function WinningDateQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem question={'가장 최근에 당첨된 날짜를 입력해주세요'} depth={3}
            name={'lastWinned'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}

{/* 당첨이력 - 부적격자 판정된 날짜가 언제인가요? */ }
function DisqualifiedDate({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem question={'부적격자 판정된 날짜가 언제인가요?'} depth={3}
            name={'ineligible'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}