import { Button, Dropdown, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { InputNumberItem, InputNumberLoopSubItemWithFollowQuestions, InputNumberSubItem } from "./InputNumberItem";
import { RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { CheckButtonSubItem, CheckButtonSubItemWithFollowQuestions } from "./CheckButtonItem";
import { placeholderText } from "./placeholderText";

export default function Condition02Content() {

    const navigate = useNavigate();

   const livingWithGreatGrandParentsButtons = { name: 'isLivingWithGreatGrandParents', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
   const livingWithParentsButtons = { name: 'isLivingWithParent', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
   const livingWithChildrenButtons = { name: 'isLivingWithChildren', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오', hasFollowUpQuestion: true }] }
   const livingWithSpouseButtons = { name: 'isLivingWithSpouse', values: [{ value: '예' }, { value: '아니오', hasFollowUpQuestion: true }] }
   const spouseLivingWithChildrenButtons = { name: 'isSpouseLivingWithChildren', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
   const livingWithInLawsButtons = { name: 'islivingWithInLaws', values: [{ value: '예', hasFollowUpQuestion: true }, { value: '아니오' }] }
   const hasSpouse = true;
   
    
    /* 제출용 데이터 */
    const [formData, setFormData] = useState({});

    /* 꼬리질문 가시성 */
    const followUpQuestions = { isLivingWithGreatGrandParents : 'livingWith', isLivingWithParent: 'livingWithParents', isLivingWithChildren: 'livingWithChildren', 
        isLivingWithSpouse: 'spouseLivingWith', isSpouseLivingWithChildren: 'spouseLivingWithChildren', islivingWithInLaws: 'livingWithinLaws',  };
    const [visibility, setVisibility] = useState({ livingWith: false, livingWithParents: false, livingWithChildren: false,  
        spouseLivingWith: false, spouseLivingWithChildren: false, livingWithinLaws: false });


    function handlePrevButtonClick(e) {

        console.log(formData);

        navigate("/condition-1");
    }

    function handleNextButtonClick(e) {

        console.log(formData);

        navigate("/condition-3");
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

                {/* 본인' 또는 배우자'의 증, 조부모와 같이 살고 계신가요? */}
                <RadioButtonItem number={1} question={'본인/ 또는 배우자/의 증, 조부모와 같이 살고 계신가요?'} 
                    buttons={livingWithGreatGrandParentsButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 같이 살고 있는 사람을 선택해주세요 */}
                <LivingWithGrandParentsFollwUpQuestion onChangedInputValue={onChangedInputValue} 
                    hasSpouse={hasSpouse} visibility={visibility['livingWith']}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* 본인' 또는 배우자'의 부모님과 같이 살고 계신가요? */}
                <RadioButtonItem number={2} question={'본인/ 또는 배우자/의 부모님과 같이 살고 계신가요?'} 
                    buttons={livingWithParentsButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 같이 살고 있는 사람을 선택해주세요 */}
                <LivingWithParentsFollwUpQuestion onChangedInputValue={onChangedInputValue} 
                    hasSpouse={hasSpouse} visibility={visibility['livingWithParents']}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* 자녀와 같이 살고 계신가요? */}
                <RadioButtonItem number={3} question={'자녀와 같이 살고 계신가요?'} 
                    buttons={livingWithChildrenButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 몇 명의 자녀와 같이 살고 계신가요? */}
                <LivingWithChildrenFollwUpQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['livingWithChildren']} />

                {/* 배우자와 같이 살고 계신가요? */}
                <RadioButtonItem number={3} question={'배우자와 같이 살고 계신가요?'} 
                    buttons={livingWithSpouseButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 배우자 거주 정보 */}
                <SpouseLivingWithFollwUpQuestion onChangedInputValue={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
                    visibility={visibility['spouseLivingWith']} buttons={spouseLivingWithChildrenButtons} subQuestionVisibility={visibility['spouseLivingWithChildren']} />

                {/* 사위 또는 며느리와 같이 살고 계신가요? */}
                <RadioButtonItem number={3} question={'사위 또는 며느리와 같이 살고 계신가요?'} 
                    buttons={livingWithInLawsButtons} direction={'horizontal'} onChange={onChangedInputValue}
                    handleFollowUpQuestion={handleFollowUpQuestion} />

                {/* [꼬리질문] 몇 명의 사위 또는 며느리와 살고 계신가요? */}
                <LivingWithInLawsFollwUpQuestion onChangedInputValue={onChangedInputValue} visibility={visibility['livingWithinLaws']} />

                {/* 다음으로 */}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="light" onClick={handlePrevButtonClick} style={{flex:'1'}} >이전</Button>
                    <Button variant="dark" onClick={handleNextButtonClick} style={{flex:'1'}} >다음</Button>
                </Stack>
            </Stack>

        </Form>
    );
}

{/* 증,조부모 동거 - 같이 살고 있는 사람을 선택해주세요 */}
function LivingWithGrandParentsFollwUpQuestion({ onChangedInputValue, hasSpouse, handleFollowUpQuestion, visibility }) {


    const livingWithGrandParentsButtons = { name: 'livingWith', values: [
        { value: '본인의 증조할아버지', hasFollowUpQuestion: true }, 
        { value: '본인의 증조할머니', hasFollowUpQuestion: true }, 
        { value: '본인의 할아버지', hasFollowUpQuestion: true }, 
        { value: '본인의 할머니', hasFollowUpQuestion: true }, 
        { value: '배우자의 증조할아버지', hasFollowUpQuestion: true }, 
        { value: '배우자의 증조할머니', hasFollowUpQuestion: true }, 
        { value: '배우자의 할아버지', hasFollowUpQuestion: true }, 
        { value: '배우자의 할머니', hasFollowUpQuestion: true }, 
        ]};

    if(!visibility) {
        return ;
    }

    return (
        <CheckButtonSubItemWithFollowQuestions number={'1-1'} question={'같이 살고 있는 사람을 선택해주세요'} depth={3}
            buttons={livingWithGrandParentsButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={LivingWithGrandParentsFollwUpQuestion2} />
    );
}

{/* 증,조부모 동거 - 동거기간을 선택해주세요 */}
function LivingWithGrandParentsFollwUpQuestion2({ onChangedInputValue, visibility }) {

    const livingForButtons = { name: 'livingFor', values: [{ value: '1년 미만' }, { value: '1년 이상 3년 미만' }, { value: '3년 이상' }]};

    if(!visibility) {
        return ;
    }

    return (
        <RadioButtonSubItem number={'1-2'} question={'동거 기간을 선택해주세요'} depth={4}
            buttons={livingForButtons} onChange={onChangedInputValue} />
    );
}

{/* 부모와 동거 - 같이 살고 있는 사람을 선택해주세요 */}
function LivingWithParentsFollwUpQuestion({ onChangedInputValue, hasSpouse, handleFollowUpQuestion, visibility }) {


    const livingWithGrandParentsButtons = { name: 'livingWithParents', values: [
        { value: '본인의 아버지', hasFollowUpQuestion: true }, 
        { value: '본인의 어머니', hasFollowUpQuestion: true }, 
        { value: '배우자의 아버지', hasFollowUpQuestion: true }, 
        { value: '배우자의 어머니', hasFollowUpQuestion: true }, 
        ]};

    if(!visibility) {
        return ;
    }

    return (
        <CheckButtonSubItemWithFollowQuestions number={'2-1'} question={'같이 살고 있는 사람을 선택해주세요'} depth={3}
            buttons={livingWithGrandParentsButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={LivingWithParentsFollwUpQuestion2} />
    );
}

{/* 부모와 동거 - 생년월일과 동거기간을 선택해주세요 */}
function LivingWithParentsFollwUpQuestion2({ onChangedInputValue, visibility }) {

    const livingForButtons = { name: 'livingFor', values: [{ value: '1년 미만' }, { value: '1년 이상 3년 미만' }, { value: '3년 이상' }]};

    if(!visibility) {
        return ;
    }

    return (
        <>
        <InputNumberSubItem number={'2-2'} question={'생년월일 입력'} depth={4}
                    name={'familyBirth'} onChange={onChangedInputValue} placeholder={'20100101'} />
        <RadioButtonSubItem number={'2-3'} question={'동거 기간을 선택해주세요'} depth={4}
            buttons={livingForButtons} onChange={onChangedInputValue} />
        </>
    );
}

{/* 자식과 동거 - 몇 명의 자녀와 살고 계신가요? */}
function LivingWithChildrenFollwUpQuestion({ onChangedInputValue, hasSpouse, handleFollowUpQuestion, visibility }) {

    if(!visibility) {
        return ;
    }

    return (
        <InputNumberLoopSubItemWithFollowQuestions number={'3-1'} question={'몇 명의 자녀와 살고 계신가요?'} depth={3}

            name={'livingWithChildren'} onChange={onChangedInputValue} 
            handleFollowUpQuestion={handleFollowUpQuestion}
            subQuestion={LivingWithChildrenInfoQuestion} unit={'명'} maxLength={2} placeholder={placeholderText.peopleCountType} />
    );
}

{/* 자식과 동거 - 자녀 정보 */}
function LivingWithChildrenInfoQuestion({ onChangedInputValue, handleFollowUpQuestion, childCount }) {

    return (
        <CheckButtonSubItemWithFollowQuestions number={'3-2'} question={`자녀${childCount} `} depth={4}
            buttons={{name: `isFetus${childCount}`, values:[{value: '태아', hasFollowUpQuestion: true }]}} 
            onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion} 
            subQuestion={LivingWithChildrenFollwUpQuestion2} reverseCheck={true} />
    );
}

{/* 자식과 동거 - 자녀 생년월일과 혼인여부, 동거기간을 입력해주세요 */}
function LivingWithChildrenFollwUpQuestion2({ onChangedInputValue, visibility }) {

    const isMarriedButtons = { name: 'children-isMarried', values: [{ value: '미혼' }, { value: '기혼' }]};
    const livingForButtons = { name: 'livingFor', values: [{ value: '1년 미만' }, { value: '1년 이상 3년 미만' }, { value: '3년 이상' }]};

    if(!visibility) {
        return ;
    }

    return (
        <>
        <InputNumberSubItem number={'3-3'} question={'생년월일 입력'} depth={4}
            name={'childBirth'} onChange={onChangedInputValue} placeholder={'20100101'} />
        <RadioButtonSubItem number={'3-4'} question={'자녀 혼인 여부'} depth={4} direction={'horizontal'}
            buttons={isMarriedButtons} onChange={onChangedInputValue} />
        <RadioButtonSubItem number={'3-5'} question={'동거 기간을 선택해주세요'} depth={4}
            buttons={livingForButtons} onChange={onChangedInputValue} />
        </>
    );
}

{/* 배우자 동거인 정보 */}
function SpouseLivingWithFollwUpQuestion({ onChangedInputValue, handleFollowUpQuestion, visibility, buttons, subQuestionVisibility }) {
    
    const spouseHouseHolderButtons = { name: 'spouseIsHouseholder', values: [{ value: '예' }, { value: '아니오' }] }
    const spouseLivingWithButtons = { name: 'spouselivingWith', values: [
        { value: '본인의 증조할아버지', hasFollowUpQuestion: true }, 
        { value: '본인의 증조할머니', hasFollowUpQuestion: true }, 
        { value: '본인의 할아버지', hasFollowUpQuestion: true }, 
        { value: '본인의 할머니', hasFollowUpQuestion: true }, 
        { value: '배우자의 증조할아버지', hasFollowUpQuestion: true }, 
        { value: '배우자의 증조할머니', hasFollowUpQuestion: true }, 
        { value: '배우자의 할아버지', hasFollowUpQuestion: true }, 
        { value: '배우자의 할머니', hasFollowUpQuestion: true }, 
        { value: '본인의 아버지', hasFollowUpQuestion: true }, 
        { value: '본인의 어머니', hasFollowUpQuestion: true }, 
        { value: '배우자의 아버지', hasFollowUpQuestion: true }, 
        { value: '배우자의 어머니', hasFollowUpQuestion: true }, 
        ]};
    
    
    if(!visibility) {
        return ;
    }

    return (
        <>
        <RadioButtonSubItem number={'4-1'} question={'배우자가 분리세대의 세대주인가요?'} depth={3} direction={'horizontal'}
            buttons={spouseHouseHolderButtons} onChange={onChangedInputValue} />

        <CheckButtonSubItemWithFollowQuestions number={'4-2'} question={'배우자와 같이 살고 있는 사람을 선택해주세요'} depth={3}
            buttons={spouseLivingWithButtons} onChange={onChangedInputValue}
            handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={LivingWithGrandParentsFollwUpQuestion2} />
        
        <RadioButtonSubItem number={'4-3'} question={'배우자가 자녀(태아 포함)와 함께 살고 계신가요?'} 
            buttons={buttons} direction={'horizontal'} onChange={onChangedInputValue} depth={3}
            handleFollowUpQuestion={handleFollowUpQuestion} />

        <SpouseLivingWithChildrenFollwUpQuestion onChangedInputValue={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion}
            visibility={subQuestionVisibility} />
    
        </>
    );
}

{/* 배우자가 자식과 동거 - 몇 명의 자녀와 살고 계신가요? */}
function SpouseLivingWithChildrenFollwUpQuestion({ onChangedInputValue, handleFollowUpQuestion, visibility }) {

    if(!visibility) {
        return ;
    }

    return (
        <InputNumberLoopSubItemWithFollowQuestions number={'4-4'} question={'몇 명의 자녀와 살고 계신가요?'} depth={4}
            name={'spouseLivingWithChildren'} onChange={onChangedInputValue} 
            handleFollowUpQuestion={handleFollowUpQuestion}
            subQuestion={SpouseLivingWithChildrenInfoQuestion} unit={'명'} maxLength={2} placeholder={placeholderText.peopleCountType} /> 
    );
}

{/* 배우자가 자식과 동거 - 자녀 정보 */}
function SpouseLivingWithChildrenInfoQuestion({ onChangedInputValue, handleFollowUpQuestion, childCount }) {

    return (
        <CheckButtonSubItemWithFollowQuestions number={'4-5'} question={`자녀${childCount} `} depth={4}
            buttons={{name: 'isFetus', values:[{value: '태아', hasFollowUpQuestion: true }]}} 
            onChange={onChangedInputValue} handleFollowUpQuestion={handleFollowUpQuestion} 
            subQuestion={SpouseLivingWithChildrenFollwUpQuestion2} reverseCheck={true} />
    );
}

{/* 배우자가 자식과 동거 - 자녀 생년월일과 혼인여부, 동거기간을 입력해주세요 */}
function SpouseLivingWithChildrenFollwUpQuestion2({ onChangedInputValue, visibility }) {

    const isMarriedButtons = { name: 'children-isMarried', values: [{ value: '미혼' }, { value: '기혼' }]};
    const livingForButtons = { name: 'livingFor', values: [{ value: '1년 미만' }, { value: '1년 이상 3년 미만' }, { value: '3년 이상' }]};

    if(!visibility) {
        return ;
    }

    return (
        <>
        <InputNumberSubItem number={'4-6'} question={'생년월일 입력'} depth={4}
            name={'childBirth'} onChange={onChangedInputValue} placeholder={placeholderText.dateType} />
        <RadioButtonSubItem number={'4-7'} question={'자녀 혼인 여부'} depth={4} direction={'horizontal'}
            buttons={isMarriedButtons} onChange={onChangedInputValue} />
        <RadioButtonSubItem number={'4-8'} question={'동거 기간을 선택해주세요'} depth={4}
            buttons={livingForButtons} onChange={onChangedInputValue} />
        </>
    );
}

{/* 사위 또는 며느리와 동거 - 몇 명의 사위 또는 며느리와 살고 계신가요? */}
function LivingWithInLawsFollwUpQuestion({ onChangedInputValue, visibility }) {
    if(!visibility) {
        return ;
    }

    return (
        <>
        <InputNumberSubItem number={'5-1'} question={'몇 명의 사위 또는 며느리와 살고 계신가요?'} depth={3}
                    name={'inLawsCount'} onChange={onChangedInputValue} unit={'명'} placeholder={placeholderText.peopleCountType} />
        </>
    );
}
