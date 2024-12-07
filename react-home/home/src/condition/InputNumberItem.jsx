import { Form } from "react-bootstrap";
import { useState } from "react";

export function InputNumberItem({ number, question, name, onChange, maxLength, placeholder }) {

    return (
        <>
            <div key={`${number}-${question}`}>
                <p className="card-header-text"><b className="px-2">{number.toString().padStart(2, '0')}</b>{question}</p>
                <InputText name={name} onChange={onChange} maxLength={maxLength} placeholder={placeholder} />
            </div>
        </>
    );
}

export function InputNumberSubItem({ number, question, depth = 1, name, onChange, maxLength, placeholder }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number}.&nbsp;{question}</p>
                <InputText name={name} onChange={onChange} maxLength={maxLength} placeholder={placeholder} />
            </div>
        </>
    );
}

export function InputText({ name, onChange, maxLength, placeholder }) {

    function handleInputChange(e) {
        const name = e.target.getAttribute('name');
        const value = e.target.value;
        onChange({name: name, value: value});
    }

    return (
        <>
            <Form.Control
                    type="number"
                    placeholder={placeholder}
                    name={name}
                    onChange={handleInputChange}
                    required
                />
        </>
    );
}

export function InputNumberLoopSubItemWithFollowQuestions({ number, question, depth = 1, name, onChange, handleFollowUpQuestion, subQuestion, maxLength, placeholder, unit }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number}.&nbsp;{question}</p>
                <InputTextWithFollowQuestions name={name} onChange={onChange} 
                    handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} maxLength={maxLength} placeholder={placeholder} unit={unit} />
            </div>
        </>
    );
}

function InputTextWithFollowQuestions({ name, onChange, handleFollowUpQuestion, subQuestion, maxLength = 8, placeholder, unit }) {

    const [repeatCount, setRepeatCount] = useState(0);

    function handleInputChange(e) {
        const name = e.target.getAttribute('name');
        const value = e.target.value;
        onChange({name: name, value: value});
        setRepeatCount(e.target.value);

        if (typeof handleFollowUpQuestion === 'function') {
            let visible = false;
            if (e.target.value.hasFollowUpQuestion === true) {
                visible = true;
            }
            handleFollowUpQuestion({ name: name, visible: visible });
        }
    }

    return (
        <>
            <Form.Control
                    type="number"
                    placeholder={placeholder}
                    name={name}
                    onChange={handleInputChange}
                    required
                />

            {Array.from({ length: repeatCount }).map((_, index) => (
            <div key={index}>
                {subQuestion({ 
                    onChangedInputValue: onChange, 
                    childCount: index + 1
                })}
            </div>
            ))}
        </>
    );
}