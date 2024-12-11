import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FamilyInputNumberSubItem, InputNumberItem, InputNumberLoopSubItemWithFollowQuestions, InputNumberSubItem } from "./InputNumberItem";
import { FamilyRadioButtonSubItem, RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { CheckButtonSubItem, CheckButtonSubItemWithFollowQuestions } from "./CheckButtonItem";
import { placeholderText } from "./placeholderText";
import { FamilyMember, familyMemberNames } from "./family.ts";

export default function Condition02Content() {

    const navigate = useNavigate();

    const livingWithGreatGrandParentsButtons = { name: 'grandparents', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const livingWithParentsButtons = { name: 'parents', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const livingWithChildrenButtons = { name: 'children', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N', hasFollowUpQuestion: true }] }
    const livingWithSpouseButtons = { name: 'spouse', values: [{ data: '예', value: 'Y' }, { data: '아니오', value: 'N', hasFollowUpQuestion: true }] }
    const spouseLivingWithChildrenButtons = { name: 'isSpouseLivingWithChildren', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }
    const livingWithInLawsButtons = { name: 'inLaws', values: [{ data: '예', value: 'Y', hasFollowUpQuestion: true }, { data: '아니오', value: 'N' }] }

    const [hasSpouse, setHasSpouse] = useState(false);
    const [hasMarried, setHasMarried] = useState(false);
    const [hasInLaw, setHasInLaw] = useState(false);

    /* 제출용 데이터 */
    const [formData, setFormData] = useState({});
    const [familyData, setFamilyData] = useState([{relationship : 1, livingTogether: 1}]);

    /* 꼬리질문 가시성 */
    const followUpQuestions = {
        grandparents: [{ value: 'Y', subQuestionId: 'livingWith' }],
        parents: [{ value: 'Y', subQuestionId: 'livingWithParents' }],
        children: [{ value: 'Y', subQuestionId: 'livingWithChildren' }, { value: 'N', subQuestionId: 'grandchildren' }],
        grandchildren: [{ value: 'Y', subQuestionId: 'grandChildrenCount' }],
        spouse: [{ value: 'N', subQuestionId: 'spouseLivingWith' }],
        isSpouseLivingWithChildren: [{ value: 'Y', subQuestionId: 'spouseLivingWithChildren' }],
        inLaws: [{ value: 'Y', subQuestionId: 'livingWithInLaws' }],
    };

    const [visibility, setVisibility] = useState({
        livingWith: false, livingWithParents: false, livingWithChildren: false, grandchildren: false,
        grandChildrenCount: false,
        spouseLivingWith: false, spouseLivingWithChildren: false, livingWithInLaws: false
    });

    useEffect(() => {
        /* 이전 폼 데이터 읽어오기 */
        const sessionData = sessionStorage.getItem('formData1');
        let userData = null;
        try {
            userData = JSON.parse(sessionData);
            setHasSpouse(userData.married === 1 || userData.married === 2);
            setHasMarried(userData.married > 0);
            setHasInLaw(userData.married === 1 || userData.married === 3);

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

        sessionStorage.removeItem('formData1');
        navigate("/condition-1");
    }

    function handleNextButtonClick(e) {

        console.log(formData);
        console.log(familyData);

        let finalFamilyData = familyData;
        let finalHasSpouse = false;

        sessionStorage.removeItem('hasSpouse');

        if(formData['spouse'] === 'Y' ) {
            finalFamilyData = {...familyData, [2]: []};
            finalHasSpouse = true;
        }

        sessionStorage.setItem('hasSpouse', finalHasSpouse);
        sessionStorage.setItem('formData2', JSON.stringify(formData));
        sessionStorage.setItem('familyData', JSON.stringify(finalFamilyData));
        
        // navigate("/condition-3");
    }

    /* formData 업데이트 */
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

    /**
     * updates 예 : { livingTogether: '2024-12-09', livingTogetherDate: 5 }
     * 
     */
    function onChangedFamilyValue({ code, livingTogether, index, updates }) {
        setFamilyData((prevFamilyData) => {
            const existingData = prevFamilyData[code] || []; // 해당 code가 없으면 빈 배열로 초기화

            const updatedData = existingData.some((item) => item.index === index)
                ? existingData.map((item) =>
                    item.index === index
                        ? { ...item, ...updates } // 조건에 맞는 항목 업데이트
                        : item
                )
                : [...existingData, { index, ...updates }]; // 조건에 맞는 항목이 없으면 새 항목 추가

            return {
                ...prevFamilyData,
                [code]: updatedData,
            };
        });
    }

    // value는 상위 질문 옵션값임
    function handleFollowUpQuestion({ name, value }) {
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

                {/* 본인' 또는 배우자'의 증, 조부모와 같이 살고 계신가요? */}
                <GrandParents hasSpouse={hasSpouse}
                    buttons={livingWithGreatGrandParentsButtons} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 같이 살고 있는 사람을 선택해주세요 */}
                <LivingWithGrandParentsFollwUpQuestion onChangedInputValue={onChangedInputValue}
                    hasSpouse={hasSpouse} visibility={visibility['livingWith']}
                    handleFollowUpQuestion={handleFollowUpQuestion} onChangedFamilyValue={onChangedFamilyValue} />

                {/* 본인' 또는 배우자'의 부모님과 같이 살고 계신가요? */}
                <Parents hasSpouse={hasSpouse}
                    buttons={livingWithParentsButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 같이 살고 있는 사람을 선택해주세요 */}
                <LivingWithParentsFollwUpQuestion onChangedInputValue={onChangedInputValue}
                    hasSpouse={hasSpouse} visibility={visibility['livingWithParents']}
                    handleFollowUpQuestion={handleFollowUpQuestion} onChangedFamilyValue={onChangedFamilyValue} />

                {/* 자녀와 같이 살고 계신가요? */}
                {hasMarried && <RadioButtonItem number={3} question={'자녀와 같이 살고 계신가요?'}
                    buttons={livingWithChildrenButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />}

                {/* [꼬리질문] 몇 명의 자녀와 같이 살고 계신가요? */}
                <LivingWithChildrenFollwUpQuestion onChangedInputValue={onChangedInputValue}
                    visibility={visibility['livingWithChildren']} onChangedFamilyValue={onChangedFamilyValue} />

                {/* [꼬리질문] 부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀와 같이 살고 계신가요? */}
                <LivingWithGrandChildrenFollwUpQuestion onChangedInputValue={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
                    visibility={visibility['grandchildren']} />

                <LivingWithGrandChildrenInfoQuestion onChangedFamilyValue={onChangedFamilyValue} handleFollowUpQuestion={handleFollowUpQuestion}
                     visibility={visibility['grandChildrenCount']} />

                {/* 배우자와 같이 살고 계신가요? */}
                {hasSpouse && <RadioButtonItem number={3} question={'배우자와 같이 살고 계신가요?'}
                    buttons={livingWithSpouseButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />}

                {/* [꼬리질문] 배우자 거주 정보 */}
                <SpouseLivingWithFollwUpQuestion onChangedInputValue={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
                    visibility={visibility['spouseLivingWith']} buttons={spouseLivingWithChildrenButtons} 
                    subQuestionVisibility={visibility['spouseLivingWithChildren']} onChangedFamilyValue={onChangedFamilyValue} />

                {/* 사위 또는 며느리와 같이 살고 계신가요? */}
                {hasInLaw && <LivingWithInLaws buttons={livingWithInLawsButtons} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} hasSpouse={hasSpouse}/>}

                {/* [꼬리질문] 몇 명의 사위 또는 며느리와 살고 계신가요? */}
                <LivingWithInLawsFollwUpQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['livingWithInLaws']} />

                {/* 다음으로 */}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>
                    <Button variant="dark" onClick={handleNextButtonClick} style={{ flex: '1' }} >다음</Button>
                </Stack>
            </Stack>

        </Form>
    );
}

{/* 본인' 또는 배우자'의 증, 조부모와 같이 살고 계신가요? */ }
function GrandParents({ hasSpouse, buttons, onChange, handleFollowUpQuestion }) {
    let question = '본인의 증, 조부모와 같이 살고 계신가요?';

    if (hasSpouse) {
        question = '본인 또는 배우자의 증, 조부모와 같이 살고 계신가요?';
    }

    return (
        <RadioButtonItem number={1} question={question}
            buttons={buttons} direction={'horizontal'} onChange={onChange}
            handleFollowUpQuestion={handleFollowUpQuestion} />
    );
}

{/* 증,조부모 동거 - 같이 살고 있는 사람을 선택해주세요 */ }
function LivingWithGrandParentsFollwUpQuestion({ onChangedInputValue, hasSpouse, handleFollowUpQuestion, visibility, onChangedFamilyValue }) {

    let livingWithGrandParentsButtons = {
        name: 'grandParentsLivingWith', values: [
            { value: FamilyMember.GREAT_GRANDFATHER, data: familyMemberNames[FamilyMember.GREAT_GRANDFATHER], hasFollowUpQuestion: true },
            { value: FamilyMember.GREAT_GRANDMOTHER, data: familyMemberNames[FamilyMember.GREAT_GRANDMOTHER], hasFollowUpQuestion: true },
            { value: FamilyMember.GRANDFATHER, data: familyMemberNames[FamilyMember.GRANDFATHER], hasFollowUpQuestion: true },
            { value: FamilyMember.GRANDMOTHER, data: familyMemberNames[FamilyMember.GRANDMOTHER], hasFollowUpQuestion: true },

        ]
    };

    if (hasSpouse) {
        livingWithGrandParentsButtons.values.push(
            { value: FamilyMember.SPOUSE_GREAT_GRANDFATHER, data: familyMemberNames[FamilyMember.SPOUSE_GREAT_GRANDFATHER], hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_GREAT_GRANDMOTHER, data: familyMemberNames[FamilyMember.SPOUSE_GREAT_GRANDMOTHER], hasFollowUpQuestion: true },
            { value: FamilyMember.GRANDFATHER, data: familyMemberNames[FamilyMember.SPOUSE_GRANDFATHER], hasFollowUpQuestion: true },
            { value: FamilyMember.GRANDMOTHER, data: familyMemberNames[FamilyMember.SPOUSE_GRANDMOTHER], hasFollowUpQuestion: true },
        );
    }

    if (!visibility) {
        return;
    }

    return (
        <CheckButtonSubItemWithFollowQuestions number={'1-1'} question={'같이 살고 있는 사람을 선택해주세요'} depth={3}
            buttons={livingWithGrandParentsButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={LivingWithGrandParentsFollwUpQuestion2}
            onChangedFamilyValue={onChangedFamilyValue} />
    );
}

{/* 증,조부모 동거 - 동거기간을 선택해주세요 */ }
function LivingWithGrandParentsFollwUpQuestion2({ onChangedFamilyValue, visibility, code }) {

    const livingForButtons = { code: code, name: 'livingTogetherDate', values: [{ data: '1년 미만', value: 0 }, { data: '1년 이상 3년 미만', value: 1 }, { data: '3년 이상', value: 2 }] };

    if (!visibility) {
        return;
    }

    return (
        <FamilyRadioButtonSubItem number={'1-2'} question={'동거 기간을 선택해주세요'} depth={4}
            buttons={livingForButtons} onChangedFamilyValue={onChangedFamilyValue} />
    );
}


{/* 본인' 또는 배우자'의 부모님과 같이 살고 계신가요? */ }
function Parents({ hasSpouse, buttons, onChange, handleFollowUpQuestion }) {

    let question = '본인의 부모님과 같이 살고 계신가요?';
    if (hasSpouse) {
        question = '본인 또는 배우자의 부모님과 같이 살고 계신가요?';
    }

    return (
        <RadioButtonItem number={2} question={question}
            buttons={buttons} direction={'horizontal'} onChange={onChange}
            handleFollowUpQuestion={handleFollowUpQuestion} />
    );
}

{/* 부모와 동거 - 같이 살고 있는 사람을 선택해주세요 */ }
function LivingWithParentsFollwUpQuestion({ onChangedInputValue, hasSpouse, handleFollowUpQuestion, visibility, onChangedFamilyValue }) {

    let livingWithGrandParentsButtons = {
        name: 'parentslivingWith', values: [
            { value: FamilyMember.FATHER, data: familyMemberNames[FamilyMember.FATHER], hasFollowUpQuestion: true },
            { value: FamilyMember.MOTHER, data: familyMemberNames[FamilyMember.MOTHER], hasFollowUpQuestion: true },

        ]
    };

    if (hasSpouse) {
        livingWithGrandParentsButtons.values.push(
            { value: FamilyMember.SPOUSE_FATHER, data: familyMemberNames[FamilyMember.SPOUSE_FATHER], hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_MOTHER, data: familyMemberNames[FamilyMember.SPOUSE_MOTHER], hasFollowUpQuestion: true },
        );
    }

    if (!visibility) {
        return;
    }

    return (
        <CheckButtonSubItemWithFollowQuestions number={'2-1'} question={'같이 살고 있는 사람을 선택해주세요'} depth={3}
            buttons={livingWithGrandParentsButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={LivingWithParentsFollwUpQuestion2} 
            onChangedFamilyValue={onChangedFamilyValue} />
    );
}

{/* 부모와 동거 - 생년월일과 동거기간을 선택해주세요 */ }
function LivingWithParentsFollwUpQuestion2({ onChangedFamilyValue, visibility, code }) {

    const livingForButtons = { code: code, name: 'livingTogetherDate', values: [{ data: '1년 미만', value: 0 }, { data: '1년 이상 3년 미만', value: 1 }, { data: '3년 이상', value: 2 }] };

    if (!visibility) {
        return;
    }

    return (
        <>
            <FamilyInputNumberSubItem code={code} number={'2-2'} question={'생년월일 입력'} depth={4}
                name={'birthday'} type={'date'} onChangedFamilyValue={onChangedFamilyValue} placeholder={placeholderText.dateType} />
            <FamilyRadioButtonSubItem number={'2-3'} question={'동거 기간을 선택해주세요'} depth={4}
                buttons={livingForButtons} onChangedFamilyValue={onChangedFamilyValue} />
        </>
    );
}

{/* 자식과 동거 - 몇 명의 자녀와 살고 계신가요? */ }
function LivingWithChildrenFollwUpQuestion({ onChangedInputValue, onChangedFamilyValue, handleFollowUpQuestion, visibility }) {

    if (!visibility) {
        return;
    }

    return (
        <InputNumberLoopSubItemWithFollowQuestions number={'3-1'} question={'몇 명의 자녀와 살고 계신가요?'} depth={3}

            name={'livingWithChildren'} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} onChangedFamilyValue={onChangedFamilyValue}
            subQuestion={LivingWithChildrenInfoQuestion} unit={'명'} placeholder={placeholderText.peopleCountType} />
    );
}

{/* 자식과 동거 - 자녀 정보 */ }
function LivingWithChildrenInfoQuestion({ onChangedInputValue, onChangedFamilyValue, handleFollowUpQuestion, index }) {

    return (
        <CheckButtonSubItemWithFollowQuestions number={'3-2'} question={`자녀${index+1} `} depth={4} index={index}
            buttons={{ code: FamilyMember.UNBORN_CHILD, name: 'isFetus', values: [{ data: '태아', value: 'Y', hasFollowUpQuestion: true }] }}
            onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
            onChangedFamilyValue={onChangedFamilyValue}
            subQuestion={LivingWithChildrenFollwUpQuestion2} reverseCheck={true} />
    );
}

{/* 자식과 동거 - 자녀 생년월일과 혼인여부, 동거기간을 입력해주세요 */ }
function LivingWithChildrenFollwUpQuestion2({ onChangedFamilyValue, visibility, index }) {

    const code = FamilyMember.CHILD;
    const isMarriedButtons = { code: code, name: 'isMarried', values: [{ data: '미혼', value: 'N' }, { data: '기혼', value: 'Y' }] };
    const livingForButtons = { code: code, name: 'livingTogetherDate', values: [{ data: '1년 미만', value: 0 }, { data: '1년 이상 3년 미만', value: 1 }, { data: '3년 이상', value: 2 }] };

    if (!visibility) {
        return;
    }

    return (
        <>
            <FamilyInputNumberSubItem code={code} index={index} number={'3-3'} question={'생년월일 입력'} depth={4}
                name={'birthday'} onChangedFamilyValue={onChangedFamilyValue} type={'date'} placeholder={placeholderText.dateType} />
            <FamilyRadioButtonSubItem index={index} number={'3-4'} question={'자녀 혼인 여부'} depth={4} direction={'horizontal'}
                buttons={isMarriedButtons} onChangedFamilyValue={onChangedFamilyValue} />
            <FamilyRadioButtonSubItem index={index} number={'3-5'} question={'동거 기간을 선택해주세요'} depth={4}
                buttons={livingForButtons} onChangedFamilyValue={onChangedFamilyValue} />
        </>
    );
}

{/* 자식과 동거 안함 - 부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀와 같이 살고 계신가요? */ }
function LivingWithGrandChildrenFollwUpQuestion({ onChangedInputValue, handleFollowUpQuestion, visibility }) {

    const grandchildren = { name: 'grandchildren', values: [{ value: 'Y', data: '예', hasFollowUpQuestion: true }, { value: 'N', data: '아니오' }] }

    if (!visibility) {
        return;
    }

    return (
        <RadioButtonSubItem number={'3-1'} question={'부모(신청자 본인의 자녀)가 사망하여 양육자가 없는 손자녀와 같이 살고 계신가요?'} depth={3}

            buttons={grandchildren} onChange={onChangedInputValue} direction={'horizontal'} 
            handleFollowUpQuestion={handleFollowUpQuestion} />
    );
}

{/* 손자녀와 동거 - 손자녀 정보 */ }
function LivingWithGrandChildrenInfoQuestion({ onChangedFamilyValue, handleFollowUpQuestion, visibility }) {

    if (!visibility) {
        return;
    }

    return (
        <InputNumberSubItem number={'3-1'} question={'몇 명의 손자녀와 살고 계신가요?'} depth={4}

            name={'grandChildrenCount'} onChange={onChangedFamilyValue}
            handleFollowUpQuestion={handleFollowUpQuestion}
            unit={'명'} maxLength={2} placeholder={placeholderText.peopleCountType} />
    );
}

{/* 배우자 동거인 정보 */ }
function SpouseLivingWithFollwUpQuestion({ onChangedInputValue, handleFollowUpQuestion, visibility, buttons, subQuestionVisibility, onChangedFamilyValue }) {

    const spouseHouseHolderButtons = { name: 'spouseIsHouseholder', values: [{ value: 'Y', data: '예' }, { value: 'N', data: '아니오' }] }
    const spouseLivingWithButtons = {
        name: 'spouselivingWith', values: [
            { value: FamilyMember.GREAT_GRANDFATHER, data: '본인의 증조할아버지', hasFollowUpQuestion: true },
            { value: FamilyMember.GREAT_GRANDMOTHER, data: '본인의 증조할머니', hasFollowUpQuestion: true },
            { value: FamilyMember.GRANDFATHER, data: '본인의 할아버지', hasFollowUpQuestion: true },
            { value: FamilyMember.GRANDMOTHER, data: '본인의 할머니', hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_GREAT_GRANDFATHER, data: '배우자의 증조할아버지', hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_GREAT_GRANDMOTHER, data: '배우자의 증조할머니', hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_GRANDFATHER, data: '배우자의 할아버지', hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_GRANDMOTHER, data: '배우자의 할머니', hasFollowUpQuestion: true },
            { value: FamilyMember.FATHER, data: '본인의 아버지', hasFollowUpQuestion: true },
            { value: FamilyMember.MOTHER, data: '본인의 어머니', hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_FATHER, data: '배우자의 아버지', hasFollowUpQuestion: true },
            { value: FamilyMember.SPOUSE_MOTHER, data: '배우자의 어머니', hasFollowUpQuestion: true },
        ]
    };


    if (!visibility) {
        return;
    }

    return (
        <>
            <RadioButtonSubItem number={'4-1'} question={'배우자가 분리세대의 세대주인가요?'} depth={3} direction={'horizontal'}
                buttons={spouseHouseHolderButtons} onChange={onChangedInputValue} />

            <CheckButtonSubItemWithFollowQuestions number={'4-2'} question={'배우자와 같이 살고 있는 사람을 선택해주세요'} depth={3}
                buttons={spouseLivingWithButtons} onChange={onChangedInputValue} onChangedFamilyValue={onChangedFamilyValue}
                handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={LivingWithGrandParentsFollwUpQuestion2} />

            <RadioButtonSubItem number={'4-3'} question={'배우자가 자녀(태아 포함)와 함께 살고 계신가요?'}
                buttons={buttons} direction={'horizontal'} onChange={onChangedInputValue} depth={3}
                handleFollowUpQuestion={handleFollowUpQuestion} />

            <SpouseLivingWithChildrenFollwUpQuestion onChangedInputValue={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
                visibility={subQuestionVisibility} onChangedFamilyValue={onChangedFamilyValue} />

        </>
    );
}

{/* 배우자가 자식과 동거 - 몇 명의 자녀와 살고 계신가요? */ }
function SpouseLivingWithChildrenFollwUpQuestion({ onChangedInputValue, handleFollowUpQuestion, visibility, onChangedFamilyValue }) {

    if (!visibility) {
        return;
    }

    return (
        <InputNumberLoopSubItemWithFollowQuestions number={'4-4'} question={'몇 명의 자녀와 살고 계신가요?'} depth={4}
            name={'spouseLivingWithChildren'} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} onChangedFamilyValue={onChangedFamilyValue}
            subQuestion={SpouseLivingWithChildrenInfoQuestion} unit={'명'} maxLength={2} placeholder={placeholderText.peopleCountType} />
    );
}

{/* 배우자가 자식과 동거 - 자녀 정보 */ }
function SpouseLivingWithChildrenInfoQuestion({ onChangedInputValue, handleFollowUpQuestion, index, onChangedFamilyValue }) {

    return (
        <CheckButtonSubItemWithFollowQuestions number={'4-5'} question={`자녀${index+1} `} depth={4}
            buttons={{ code: FamilyMember.UNBORN_CHILD, name: `isFetus${index+1}`, values: [{ data: '태아', value: 'Y', hasFollowUpQuestion: true }] }}
            onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
            onChangedFamilyValue={onChangedFamilyValue}
            subQuestion={SpouseLivingWithChildrenFollwUpQuestion2} reverseCheck={true} />
    );
}

{/* 배우자가 자식과 동거 - 자녀 생년월일과 혼인여부, 동거기간을 입력해주세요 */ }
function SpouseLivingWithChildrenFollwUpQuestion2({ onChangedInputValue, visibility, onChangedFamilyValue }) {

    const isMarriedButtons = { name: 'isMarried', values: [{ data: '미혼', value: 'N' }, { data: '기혼', value: 'Y' }] };
    const livingForButtons = { name: 'livingFor', values: [{ data: '1년 미만', value: 0 }, { data: '1년 이상 3년 미만', value: 1 }, { data: '3년 이상', value: 2 }] };

    if (!visibility) {
        return;
    }

    return (
        <>
            <FamilyInputNumberSubItem number={'4-6'} question={'생년월일 입력'} depth={4} onChangedFamilyValue={onChangedFamilyValue}
                name={'birthday'} type={'date'} placeholder={placeholderText.dateType} />
            <FamilyRadioButtonSubItem number={'4-7'} question={'자녀 혼인 여부'} depth={4} direction={'horizontal'}
                buttons={isMarriedButtons}  onChangedFamilyValue={onChangedFamilyValue} />
            <FamilyRadioButtonSubItem number={'4-8'} question={'동거 기간을 선택해주세요'} depth={4} onChangedFamilyValue={onChangedFamilyValue}
                buttons={livingForButtons}  />
        </>
    );
}
{/* 사위 또는 며느리와 동거 - 몇 명의 사위 또는 며느리와 살고 계신가요? */ }
function LivingWithInLaws({ buttons, onChangedInputValue, handleFollowUpQuestion, hasSpouse }) {

    let question = '사위 또는 며느리와 같이 살고 계신가요?';
    if(hasSpouse) {
        question = '본인 또는 배우자가 사위 또는 며느리와 같이 살고 계신가요?';
    }

    return (
        <RadioButtonItem number={3} question={question}
                    buttons={buttons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
    );
}

{/* 사위 또는 며느리와 동거 - 몇 명의 사위 또는 며느리와 살고 계신가요? */ }
function LivingWithInLawsFollwUpQuestion({ onChangedInputValue, visibility }) {
    if (!visibility) {
        return;
    }

    return (
        <>
            <InputNumberSubItem number={'5-1'} question={'몇 명의 사위 또는 며느리와 살고 계신가요?'} depth={3}
                name={'inLawsCount'} onChange={onChangedInputValue} unit={'명'} placeholder={placeholderText.peopleCountType} />
        </>
    );
}
