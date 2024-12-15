import React from "react";
import { Form, Stack } from "react-bootstrap";

export function RadioButtonItem({ question, buttons, direction, depth, flexAuto, onChange, handleFollowUpQuestion }) {

    return (
        <>
            <div key={`${question}`}>
                <p className="card-header-text">{question}</p>
                <StackedRadioButtons buttons={buttons} direction={direction} depth={depth} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
            </div>
        </>
    );
}

export function RadioButtonSubItem({ question, buttons, direction, depth = 1, flexAuto, onChange, handleFollowUpQuestion}) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{question}</p>
                <StackedRadioButtons buttons={buttons} direction={direction} flexAuto={flexAuto} onChange={onChange}
                    handleFollowUpQuestion={handleFollowUpQuestion} />
            </div>
        </>
    );
    
}

function RadioButtons({ buttons, flexAuto = true, onChange, handleFollowUpQuestion }) {

    const flexValue = flexAuto ? 1 : 'none';

    function handleRadioChange(e) {
        const name = e.target.getAttribute('name');
        const index = e.target.value;
        let value = buttons.values[index].value;

        onChange({ name: name, value: value });

        if (typeof handleFollowUpQuestion === 'function') {
            let visible = false;
            if (buttons.values[index].hasFollowUpQuestion === true) {
                visible = true;
            }
            handleFollowUpQuestion({ name: name, value: value, visible: visible });
        }
    }

    return buttons.values.map((button, index) =>
        <React.Fragment key={`buttons-${index}`}>
            <Form.Check
            required
                type={'radio'}
                name={buttons.name}
                label={button.data}
                value={index}
                id={`${buttons.name}-${index}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleRadioChange}
            />
        </React.Fragment>
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
