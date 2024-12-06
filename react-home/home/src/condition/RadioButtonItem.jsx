import React from "react";
import { Form, Stack } from "react-bootstrap";

export function RadioButtonItem({ number, question, buttons, direction, depth, flexAuto, onChange, handleFollowUpQuestion }) {

    return (
        <>
            <div key={`${number}-${question}`}>
                <p className="card-header-text"><b className="px-2">{number.toString().padStart(2, '0')}</b>{question}</p>
                <StackedRadioButtons buttons={buttons} direction={direction} depth={depth} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
            </div>
        </>
    );
}

export function RadioButtonSubItem({ number, question, buttons, direction, depth = 1, flexAuto, onChange, handleFollowUpQuestion }) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#E6E6E6'}} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
                <StackedRadioButtons buttons={buttons} direction={direction} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
            </div>
        </>
    );
}

function StackedRadioButtons({ buttons, direction = 'vertical', flexAuto, onChange, handleFollowUpQuestion }) {

    return (
        <>
            <Stack direction={direction} gap={2} >
                <RadioButtons buttons={buttons} flexAuto={flexAuto}
                    onChange={onChange} handleFollowUpQuestion={handleFollowUpQuestion} />
            </Stack>
        </>
    );
}

function RadioButtons({ buttons, flexAuto = true, onChange, handleFollowUpQuestion }) {
    const flexValue = flexAuto ? 1 : 'none';

    function handleRadioChange(e) {
        const name = e.target.getAttribute('name');
        const value = buttons.values[e.target.value].value;
        onChange({ name: name, value: value });

        if (typeof handleFollowUpQuestion === 'function') {
            let visible = false;
            if (buttons.values[e.target.value].hasFollowUpQuestion === true) {
                visible = true;
            }
            handleFollowUpQuestion({ name: name, visible: visible });
        }
    }

    return buttons.values.map((button, index) =>
        <React.Fragment key={`buttons-${index}`}>
            <Form.Check
                type={'radio'}
                name={buttons.name}
                label={button.value}
                value={index}
                id={`${buttons.name}-${index}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleRadioChange}
            />
        </React.Fragment>
    );
}