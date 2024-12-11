import React, { useState } from "react";
import { Form, Stack } from "react-bootstrap";

export function CheckButtonItem({ number, question, buttons, depth, flexAuto, onChange, handleFollowUpQuestion, reverseCheck }) {

    return (
        <>
            <div key={`${number}-${question}`}>
                <p className="card-header-text"><b className="px-2">{number.toString().padStart(2, '0')}</b>{question}</p>
                <StackedCheckButtons buttons={buttons} depth={depth} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} reverseCheck={reverseCheck} />
            </div>
        </>
    );
}

export function CheckButtonSubItem({ number, question, buttons, depth = 1, flexAuto, onChange, handleFollowUpQuestion }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6' }} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <StackedCheckButtons buttons={buttons} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
            </div>
        </>
    );
}


function StackedCheckButtons({ buttons, flexAuto, onChange, handleFollowUpQuestion, reverseCheck }) {

    return (
        <>
            <Stack direction={'vertical'} gap={2} >
                <CheckButtons buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} reverseCheck={reverseCheck} />
            </Stack>
        </>
    );
}

function CheckButtons({ buttons, flexAuto = true, onChange, handleFollowUpQuestion, reverseCheck = false }) {
    const flexValue = flexAuto ? 1 : 'none';

    const [checkedValues, setCheckedValues] = useState([]);

    function handleCheckChange(e) {
        const name = e.target.getAttribute('name');
        const value = buttons.values[e.target.value].value;

        setCheckedValues((prevItems) => {
            let updatedValues;
            if (e.target.checked) {
              updatedValues = [...prevItems, value];
            } else {
              updatedValues = prevItems.filter((v) => v !== value);
            }
        
            onChange({ name: name, value: updatedValues });
            return updatedValues;
        });

        if (typeof handleFollowUpQuestion === 'function') {

            let visible = false;
            if (buttons.values[e.target.value].hasFollowUpQuestion === true) {
                visible = e.target.checked;
            }
            visible = reverseCheck ? !visible : visible;
            handleFollowUpQuestion({ name: name, visible: visible });
        }
    }

    return buttons.values.map((button, index) =>
        <React.Fragment key={`buttons-${index}`}>
            <Form.Check
                type={'checkbox'}
                name={buttons.name}
                label={button.data}
                value={index}
                id={`${buttons.name}-${index}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleCheckChange}
            />
        </React.Fragment>
    );
}

export function CheckButtonSubItemWithFollowQuestions({ number, question, buttons, depth = 1, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck, onChangedFamilyValue, index }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6' }} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <StackedCheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} reverseCheck={reverseCheck} onChangedFamilyValue={onChangedFamilyValue} index={index} />
            </div>
        </>
    );
}


function StackedCheckButtonsWithFollowQuestions({ buttons, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck, onChangedFamilyValue, index }) {

    return (
        <>
            <Stack direction={'vertical'} gap={2} >
                <CheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} 
                    reverseCheck={reverseCheck} onChangedFamilyValue={onChangedFamilyValue} index={index} />
            </Stack>
        </>
    );
}

function CheckButtonsWithFollowQuestions({ buttons, flexAuto = true, onChange, handleFollowUpQuestion, subQuestion, reverseCheck = false, onChangedFamilyValue, index = 0 }) {
    const flexValue = flexAuto ? 1 : 'none';

    const [subQuestionVisibility, setSubQuestionVisibility] = useState(Array(buttons.values.length).fill(reverseCheck));
    const [checkedValues, setCheckedValues] = useState([]);

    function handleCheckChange(e) {
        
        const name = buttons.code;
        const idx = e.target.value;
        const value = buttons.values[idx].value;

        setCheckedValues((prevItems) => {
            let updatedValues;
            if (e.target.checked) {
              updatedValues = [...prevItems, value];
            } else {
              updatedValues = prevItems.filter((v) => v !== value);
            }
        
            onChange({ name: name, value: updatedValues });
            return updatedValues;
        });

        let visibility = e.target.checked;
        visibility = reverseCheck ? !visibility : visibility;

        setSubQuestionVisibility((prev) => {
            const newVisibility = [...prev];
            newVisibility[idx] = visibility;
            return newVisibility;
        });

        if (typeof handleFollowUpQuestion === 'function') {
            let visible = false;
            if (buttons.values[idx].hasFollowUpQuestion === true) {
                visible = true;
            }
            handleFollowUpQuestion({ name: name, visible: visible });
        }
    }

    return buttons.values.map((button, idx) =>
        <React.Fragment key={`buttons-${idx}`}>
            <Form.Check
                type={'checkbox'}
                name={`${buttons.name}-${index}`}
                label={button.data}
                value={idx}
                id={`${buttons.name}-${idx}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleCheckChange}
            />

            {subQuestion({ onChangedFamilyValue: onChangedFamilyValue, visibility: subQuestionVisibility[idx], code: button.value, index: index })}
        </React.Fragment>
    );
}

export function FetusCheckButtonSubItemWithFollowQuestions({ number, question, buttons, depth = 1, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck, onChangedFamilyValue, index }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6' }} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <FetusStackedCheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} reverseCheck={reverseCheck} onChangedFamilyValue={onChangedFamilyValue} index={index} />
            </div>
        </>
    );
}

function FetusStackedCheckButtonsWithFollowQuestions({ buttons, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck, onChangedFamilyValue, index }) {

    return (
        <>
            <Stack direction={'vertical'} gap={2} >
                <FetusCheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} 
                    reverseCheck={reverseCheck} onChangedFamilyValue={onChangedFamilyValue} index={index} />
            </Stack>
        </>
    );
}

// 태아 체크
function FetusCheckButtonsWithFollowQuestions({ buttons, flexAuto = true, handleFollowUpQuestion, subQuestion, reverseCheck = false, onChangedFamilyValue, index = 0 }) {
    const flexValue = flexAuto ? 1 : 'none';

    const [subQuestionVisibility, setSubQuestionVisibility] = useState(Array(buttons.values.length).fill(reverseCheck));
    const [checkedValues, setCheckedValues] = useState([]);

    function handleCheckChange(e) {
        
        const name = buttons.code;
        const idx = e.target.value;
        const value = buttons.values[idx].value;

        setCheckedValues((prevItems) => {
            let updatedValues;
            if (e.target.checked) {
              updatedValues = [...prevItems, value];
            } else {
              updatedValues = prevItems.filter((v) => v !== value);
            }
        
            onChangedFamilyValue({ code: name, index: index, updates: {} });
            return updatedValues;
        });

        let visibility = e.target.checked;
        visibility = reverseCheck ? !visibility : visibility;

        setSubQuestionVisibility((prev) => {
            const newVisibility = [...prev];
            newVisibility[idx] = visibility;
            return newVisibility;
        });

        if (typeof handleFollowUpQuestion === 'function') {
            let visible = false;
            if (buttons.values[idx].hasFollowUpQuestion === true) {
                visible = true;
            }
            handleFollowUpQuestion({ name: name, visible: visible });
        }
    }

    return buttons.values.map((button, idx) =>
        <React.Fragment key={`buttons-${idx}`}>
            <Form.Check
                type={'checkbox'}
                name={`${buttons.name}-${index}`}
                label={button.data}
                value={idx}
                id={`${buttons.name}-${idx}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleCheckChange}
            />

            {subQuestion({ onChangedFamilyValue: onChangedFamilyValue, visibility: subQuestionVisibility[idx], code: button.value, index: index })}
        </React.Fragment>
    );
}
