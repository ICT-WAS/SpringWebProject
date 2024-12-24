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
    const [updateMode, setUpdateMode] = useState(false);

    const navigate = useNavigate();

    const totalPropertyValueButtons = { name: 'propertyPrice', values: [{ data: '미보유 혹은 2억 1,150만원 이하', value: 0 }, { data: '2억 1,150만원 초과 3억 3,100만원 이하', value: 1 }, { data: '3억 3,100만원 초과', value: 2 }] }
    const incomeActivityTypeButtons = { name: 'incomeActivity', values: [{ data: '외벌이', value: 0 }, { data: '맞벌이', value: 1, hasFollowUpQuestion: true }] }
    const winningHistoryButtons = { name: 'lastWinned', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const wasDisqualifiedButtons = { name: 'ineligible', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }

    /* 제출용 데이터 */
    const [formData1, setFormData1] = useState({});
    const [accountDTOList, setAccountDTOList] = useState({});
    const [formData3, setFormData3] = useState({
        carPrice: 0,
        propertyPrice: null,
        totalAsset: null,
        myAsset: null,
        spouseAsset: null,
        familyAverageMonthlyIncome: null,
        previousYearAverageMonthlyIncome: null,
        incomeTaxPaymentPeriod: null,
        incomeActivity: null,
        lastWinned: null,
        ineligible: null
    });

    const [formDateData, setFormDateData] = useState({
        noVehicle: false,
        lastWinned: null,
        ineligible: null,
    });

    const [familyDataList, setFamilyDataList] = useState([]);

    const [hasSpouse, setHasSpouse] = useState(false);

    /* 꼬리질문 가시성 */
    const followUpQuestions = {
        hasVehicle: [{ value: '0', subQuestionId: 'vehicleValue' }],
        incomeActivity: [{ value: 1, subQuestionId: 'spouseIncome' }],
        lastWinned: [{ value: 'Y', subQuestionId: 'winningDate' }],
        ineligible: [{ value: 'Y', subQuestionId: 'disqualifiedDate' }]
    };

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);


    const fetchCondition = () => {
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                if (response.data.hasCondition === true) {
                    setUpdateMode(true);

                    setFormData3(response.data.form3Data);
                }

            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    };

    const updateCondition = (condition03Data) => {
            console.log(condition03Data)
            axios
                .patch(`http://localhost:8989/condition/3/${userId}`, condition03Data)
                .then((response) => {
                    console.log('업데이트 성공:', response.data);
                })
                .catch((error) => {
                    if (error.response.status === 500) {
                        console.error("서버 에러(500):", error.response.data);
                        alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
                    } else {
                        console.error("데이터 요청 실패:", error);
                    }
                    
                });
        };

    useEffect(() => {

        // 권한 확인
        if(userId === null) {
            navigate("/login");
            return;
        }

        /* 이전 폼 데이터 읽어오기 */
        // 수정모드
        fetchCondition();

        //폼3데이터
        const sessionFormData3 = sessionStorage.getItem('formData3');

        if (sessionFormData3) {
            try {
                const storedFormData3 = JSON.parse(sessionFormData3);
                setFormData3(storedFormData3);
                setFormDateData({ noVehicle: storedFormData3.carPrice <= 0, lastWinned: storedFormData3.lastWinned ? "Y" : "N", ineligible: storedFormData3.ineligible ? "Y" : "N" });
            } catch (error) { }
        }

        const sessionFormData1 = sessionStorage.getItem('formData1');
        const sessionAccountData = sessionStorage.getItem('accountDTOList');
        const sessionFamilyData = sessionStorage.getItem('familyDataList');
        const sessionSpouseFamilyData = sessionStorage.getItem('spouseFamilyDataList');
        const sessionHasSpouse = sessionStorage.getItem('hasSpouse') === 'true';
        let storedFormData1 = {};
        let storedAccountData = {};
        let storedFamilyData = {};
        let storedSpouseFamilyData = {};
        
        try {
            storedFormData1 = JSON.parse(sessionFormData1);
            storedAccountData = JSON.parse(sessionAccountData);
            storedFamilyData = JSON.parse(sessionFamilyData);
            
            storedSpouseFamilyData = JSON.parse(sessionSpouseFamilyData);

            // 상태 업데이트
            setHasSpouse(sessionHasSpouse);
            setFormData1(storedFormData1);
            setAccountDTOList(storedAccountData);
            setFamilyDataList([
                ...(storedFamilyData || []),
                ...(storedSpouseFamilyData || [])
              ]);

        } catch (error) { }

    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

    function handlePrevButtonClick(e) {

        navigate("/condition-2");
    }

    /* 폼 제출 */ 
    function handleSubmit(event) {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {

            alert('모든 항목을 입력해주세요.');
            return;
        }

        let finalFormData3 = formData3;
        if (formData3.carPrice === null) {
            finalFormData3 = { ...formData3, carPrice: 0 };
        }

        if (formDateData.ineligible === "N") {
            finalFormData3 = { ...formData3, ineligible: null };
        }

        if (formDateData.lastWinned === "N") {
            finalFormData3 = { ...formData3, lastWinned: null };
        }

        if(updateMode) {
            updateCondition(finalFormData3);
            navigate("/conditions");
            return;
        }

        console.log(familyDataList);
        const submitData = { condition01DTO: formData1, ...accountDTOList, condition03DTO: finalFormData3, familyDTOList: [...familyDataList] };
        console.log(submitData);


        const token = localStorage.getItem("accessToken");
        const userId = getUserIdFromToken(token);

        // POST 요청

        setLoading(true);
        axios
            .post(`http://localhost:8989/condition/${userId}`, submitData)
            .then((response) => {
                setLoading(false);

                navigate("/conditions");
            })
            .catch((error) => {
                console.error("데이터 저장 실패:", error);
                setLoading(false);
            });
    };

    function onChangedInputValue({ name, value }) {
        setFormData3(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function onChangedDateRadioValue({ name, value }) {
        setFormDateData(prevFormData => ({ ...prevFormData, [name]: value }));
    }

    function handleFollowUpQuestion({ name, value, visible }) {
        const matchedItem = followUpQuestions[name];

        if (!matchedItem || matchedItem.length < 1) {
            return;
        }

    }

    return (
        <>
            <p className='heading-text'>
                조건 등록 (3/3) - 재산 정보{updateMode ? " 수정" : " 입력" }
            </p>

            <Form noValidate onSubmit={handleSubmit}>
                <Stack direction='vertical' gap={5} >

                    {/* 차량가액을 입력해주세요 */}
                    {/* 미보유 체크시 0원 */}
                    <HasVehicle handleFollowUpQuestion={handleFollowUpQuestion} onChangedInputValue={onChangedDateRadioValue} value={formDateData?.noVehicle} />

                    {/* ![꼬리질문] 차량가액 */}
                    {formDateData?.noVehicle === false && <VehicleValueQuestion onChangedInputValue={onChangedInputValue} value={formData3?.carPrice} />}

                    {/* 소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요 */}
                    <RadioButtonItem question={'소유하신 부동산(건축물 + 토지)총 가액을 선택해주세요'}
                        buttons={totalPropertyValueButtons} onChange={onChangedInputValue} value={formData3?.propertyPrice} />

                    {/* 세대구성원 전원의 총 자산을 입력해주세요 */}
                    <InputNumberItem question={'세대구성원 전원의 총 자산을 입력해주세요'} value={formData3?.totalAsset}
                        name={'totalAsset'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                    {/* 본인의 총 자산을 입력해주세요 */}
                    <InputNumberItem question={'본인의 총 자산을 입력해주세요'} value={formData3?.myAsset}
                        name={'myAsset'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />

                    {/* 배우자의 총 자산을 입력해주세요 */}
                    {hasSpouse === true && (<InputNumberItem question={'배우자의 총 자산을 입력해주세요'}
                        name={'spouseAsset'} onChange={onChangedInputValue} value={formData3?.spouseAsset}
                        placeholder={placeholderText.largeMoneyUnitType} />)}

                    {/* 세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액 */}
                    <InputNumberItem question={'세대구성원 중 만 19세 이상 세대원 전원의 전년도 월 평균소득을 모두 합산한 금액'}
                        name={'familyAverageMonthlyIncome'} onChange={onChangedInputValue}
                        placeholder={placeholderText.moneyUnitType} value={formData3?.familyAverageMonthlyIncome} />

                    {/* 본인의 전년도 월 평균소득을 입력해주세요 */}
                    <InputNumberItem question={'본인의 전년도 월 평균소득을 입력해주세요'} value={formData3?.previousYearAverageMonthlyIncome}
                        name={'previousYearAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />

                    {/* 소득활동 여부를 선택해주세요 */}
                    {hasSpouse === true && <RadioButtonItem question={'소득활동 여부를 선택해주세요'}
                        buttons={incomeActivityTypeButtons} direction={'horizontal'} onChange={onChangedInputValue}
                        handleFollowUpQuestion={handleFollowUpQuestion} value={formData3?.incomeActivity} />}

                    {/* [꼬리질문] 배우자의 월평균소득을 입력해주세요 */}
                    {formData3?.incomeActivity === 1 && <SpouseIncomeQuestion onChangedInputValue={onChangedInputValue}
                        value={formData3?.spouseAverageMonthlyIncome} />}

                    {/* 소득세 납부 기간 */}
                    <InputNumberItem question={'소득세 납부 기간'} value={formData3?.incomeTaxPaymentPeriod}
                        name={'incomeTaxPaymentPeriod'} onChange={onChangedInputValue} placeholder={placeholderText.yearCountType} />

                    {/* 신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요? */}
                    <RadioButtonItem question={'신청자 및 세대구성원이 과거 주택 청약에 당첨된 적 있나요?'}
                        buttons={winningHistoryButtons} direction={'horizontal'} onChange={onChangedDateRadioValue}
                        handleFollowUpQuestion={handleFollowUpQuestion} value={formDateData?.lastWinned} />

                    {/* [꼬리질문] 가장 최근에 당첨된 날짜를 입력해주세요 */}
                    {formDateData?.lastWinned === "Y" && <WinningDateQuestion onChangedInputValue={onChangedInputValue}
                        value={formData3?.lastWinned} />}

                    {/* 신청자 본인이 주택청약에 당첨되고 부적격자 판정을 받은 적 있나요? */}
                    <RadioButtonItem number={15} question={'신청자 본인이 주택청약에 당첨되고 부적격자 판정을 받은 적 있나요?'}
                        buttons={wasDisqualifiedButtons} direction={'horizontal'} onChange={onChangedDateRadioValue}
                        handleFollowUpQuestion={handleFollowUpQuestion} value={formDateData?.ineligible} />

                    {/* [꼬리질문] 부적격자 판정된 날짜가 언제인가요? */}
                    {formDateData?.ineligible === "Y" && <DisqualifiedDate onChangedInputValue={onChangedInputValue}
                        value={formData3?.ineligible} />}

                    {/* 폼 제출 */}
                    
                    <Stack direction="horizontal" gap={2}>
                    {!updateMode && <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>}
                        <Button variant="dark" type="submit" style={{ flex: '1' }} >{updateMode ? "수정" : "등록" }</Button>
                    </Stack>
                </Stack>

            </Form>
            {loading && <Spinners />}
        </>
    );
}

function HasVehicle({ onChangedInputValue, value }) {

    function handleCheckChange(e) {
        onChangedInputValue({ name: 'noVehicle', value: e.target.checked });
    }

    return (
        <>
            <div>
                <p className="card-header-text">{'차량가액을 입력해주세요'}</p>
                <Form.Check
                    type={'checkbox'}
                    name={'hasVehicle'}
                    label={'차량 미보유'}
                    id={'hasVehicle-checked'}
                    style={{ flex: `1` }}
                    onChange={handleCheckChange}
                    checked={value}
                />
            </div>
        </>
    );
}

{/* 차량가액 - 차량가액을 입력해주세요 */ }
function VehicleValueQuestion({ onChangedInputValue, value }) {
    return (
        <InputNumberSubItem question={'차량가액을 입력해주세요'} depth={3} value={value}
            name={'carPrice'} onChange={onChangedInputValue} placeholder={placeholderText.largeMoneyUnitType} />
    );
}

{/* 배우자 소득활동 - 배우자의 월평균소득을 입력해주세요 */ }
function SpouseIncomeQuestion({ onChangedInputValue, value }) {
    return (
        <InputNumberSubItem question={'배우자의 월평균소득을 입력해주세요'} depth={3} value={value}
            name={'spouseAverageMonthlyIncome'} onChange={onChangedInputValue} placeholder={placeholderText.moneyUnitType} />
    );
}

{/* 당첨이력 - 가장 최근에 당첨된 날짜를 입력해주세요 */ }
function WinningDateQuestion({ onChangedInputValue, value }) {

    return (
        <InputNumberSubItem question={'가장 최근에 당첨된 날짜를 입력해주세요'} depth={3} value={value}
            name={'lastWinned'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}

{/* 당첨이력 - 부적격자 판정된 날짜가 언제인가요? */ }
function DisqualifiedDate({ onChangedInputValue, value }) {
    return (
        <InputNumberSubItem question={'부적격자 판정된 날짜가 언제인가요?'} depth={3} value={value}
            name={'ineligible'} onChange={onChangedInputValue} type={'date'} placeholder={placeholderText.dateType} />
    );
}