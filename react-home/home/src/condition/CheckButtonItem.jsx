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

export function CheckButtonSubItemWithFollowQuestions({ number, question, buttons, direction, depth = 1, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck, onChangedFamilyValue }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6' }} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <StackedCheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} reverseCheck={reverseCheck} onChangedFamilyValue={onChangedFamilyValue} />
            </div>
        </>
    );
}


function StackedCheckButtonsWithFollowQuestions({ buttons, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck, onChangedFamilyValue }) {

    return (
        <>
            <Stack direction={'vertical'} gap={2} >
                <CheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} reverseCheck={reverseCheck} onChangedFamilyValue={onChangedFamilyValue} />
            </Stack>
        </>
    );
}

function CheckButtonsWithFollowQuestions({ buttons, flexAuto = true, onChange, handleFollowUpQuestion, subQuestion, reverseCheck = false, onChangedFamilyValue }) {
    const flexValue = flexAuto ? 1 : 'none';

    const [subQuestionVisibility, setSubQuestionVisibility] = useState(Array(buttons.values.length).fill(reverseCheck));
    const [checkedValues, setCheckedValues] = useState([]);

    function handleCheckChange(e) {
        
        const name = e.target.getAttribute('name');
        const index = e.target.value;
        const value = buttons.values[index].value;

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
            newVisibility[index] = visibility;
            return newVisibility;
        });

        if (typeof handleFollowUpQuestion === 'function') {
            let visible = false;
            if (buttons.values[index].hasFollowUpQuestion === true) {
                visible = true;
            }
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

            {subQuestion({ onChangedFamilyValue: onChangedFamilyValue, visibility: subQuestionVisibility[index], code: button.value })}
        </React.Fragment>
    );
}