import React, { useState } from "react";
import { Form, Stack } from "react-bootstrap";

export function CheckButtonItem({ number, question, buttons, direction, depth, flexAuto, onChange, handleFollowUpQuestion, reverseCheck }) {

    return (
        <>
            <div key={`${number}-${question}`}>
                <p className="card-header-text"><b className="px-2">{number.toString().padStart(2, '0')}</b>{question}</p>
                <StackedCheckButtons buttons={buttons} direction={direction} depth={depth} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} reverseCheck={reverseCheck} />
            </div>
        </>
    );
}

export function CheckButtonSubItem({ number, question, buttons, direction, depth = 1, flexAuto, onChange, handleFollowUpQuestion }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6' }} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <StackedCheckButtons buttons={buttons} direction={direction} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
            </div>
        </>
    );
}


function StackedCheckButtons({ buttons, direction = 'vertical', flexAuto, onChange, handleFollowUpQuestion, reverseCheck }) {

    return (
        <>
            <Stack direction={direction} gap={2} >
                <CheckButtons buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} reverseCheck={reverseCheck} />
            </Stack>
        </>
    );
}

function CheckButtons({ buttons, flexAuto = true, onChange, handleFollowUpQuestion, reverseCheck = false }) {
    const flexValue = flexAuto ? 1 : 'none';

    function handleCheckChange(e) {
        const name = e.target.getAttribute('name');
        const value = buttons.values[e.target.value].value;
        onChange({ name: name, value: value });

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
                label={button.value}
                value={index}
                id={`${buttons.name}-${index}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleCheckChange}
            />
        </React.Fragment>
    );
}

export function CheckButtonSubItemWithFollowQuestions({ number, question, buttons, direction, depth = 1, flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6' }} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <StackedCheckButtonsWithFollowQuestions buttons={buttons} direction={direction} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} reverseCheck={reverseCheck} />
            </div>
        </>
    );
}


function StackedCheckButtonsWithFollowQuestions({ buttons, direction = 'vertical', flexAuto, onChange, handleFollowUpQuestion, subQuestion, reverseCheck }) {

    return (
        <>
            <Stack direction={direction} gap={2} >
                <CheckButtonsWithFollowQuestions buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} reverseCheck={reverseCheck} />
            </Stack>
        </>
    );
}

function CheckButtonsWithFollowQuestions({ buttons, flexAuto = true, onChange, handleFollowUpQuestion, subQuestion, reverseCheck = false }) {
    const flexValue = flexAuto ? 1 : 'none';

    const [subQuestionVisibility, setSubQuestionVisibility] = useState(Array(buttons.values.length).fill(reverseCheck));

    function handleCheckChange(e) {
        const name = e.target.getAttribute('name');
        const index = e.target.value;
        const value = buttons.values[index].value;

        onChange({ name: name, value: value });

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
                label={button.value}
                value={index}
                id={`${buttons.name}-${index}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleCheckChange}
            />

            {subQuestion({ onChangedInputValue: onChange, visibility: subQuestionVisibility[index] })}
        </React.Fragment>
    );
}