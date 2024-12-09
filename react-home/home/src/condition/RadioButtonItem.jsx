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

export function RadioButtonSubItem({ number, question, buttons, direction, depth = 1, flexAuto, onChange, handleFollowUpQuestion}) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number}.{question}</p>
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


export function FamilyRadioButtonSubItem({ index, number, question, buttons, depth = 1, onChangedFamilyValue}) {

    const marginClass = `ms-${depth}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number }.{question}</p>
                <FamilyStackedRadioButtons index={index} buttons={buttons}
                    onChangedFamilyValue={onChangedFamilyValue} />
            </div>
        </>
    );
}

function FamilyStackedRadioButtons({ index, buttons, onChangedFamilyValue }) {

    return (
        <>
            <Stack direction={'vertical'} gap={2} >
                <FamilyRadioButtons index={index} buttons={buttons}
                     onChangedFamilyValue={onChangedFamilyValue} />
            </Stack>
        </>
    );
}

function FamilyRadioButtons({ index = 0, buttons, flexAuto = true, onChangedFamilyValue }) {
    const flexValue = flexAuto ? 1 : 'none';

    function handleRadioChange(e) {
        const name = buttons.name;
        let value = buttons.values[e.target.value].value;

        onChangedFamilyValue({ code: buttons.code, index: index, updates: { [name] : value } });
    }

    return buttons.values.map((button, index) =>
        <React.Fragment key={`buttons-${index}`}>
            <Form.Check
                type={'radio'}
                name={`${buttons.code}-${buttons.name}`}
                label={button.data}
                value={index}
                id={`${buttons.name}-${index}`}
                style={{ flex: `${flexValue}` }}
                onChange={handleRadioChange}
            />
        </React.Fragment>
    );
}
