import { Form } from "react-bootstrap";
import { useState } from "react";

export function InputNumberItem({ question, name, onChange, type, placeholder }) {

    return (
        <>
            <div key={`-${question}`}>
                <p className="card-header-text">{question}</p>
                <InputText name={name} onChange={onChange} type={type} placeholder={placeholder} />
            </div>
        </>
    );
}

export function InputNumberSubItem({ question, depth = 1, name, onChange, type, placeholder }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{question}</p>
                <InputText name={name} onChange={onChange} type={type} placeholder={placeholder} />
            </div>
        </>
    );
}

export function FamilyInputNumberSubItem({ code, question, depth = 1, name, onChangedFamilyValue, type, placeholder, index }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{question}</p>
                <FamilyInputText code={code} name={name} onChangedFamilyValue={onChangedFamilyValue} type={type} placeholder={placeholder} index={index} />
            </div>
        </>
    );
}

function FamilyInputText({ code, name, onChangedFamilyValue, type='normal', placeholder, index = 0 }) {

    const [hasError, setHasError] = useState(false);

    function handleInputChange(e) {

        let value = null;

        if(type === 'date') {
            value = formatDateToCustomFormat(e.target.value.toString());
            if(value == null) {
                setHasError(true);
            }
        } else {
            e.target.value = Math.max(0, e.target.value);
            value = Number(e.target.value);
        }

        onChangedFamilyValue({ code: code, index: index, updates: { [name] : value } });
    }

    return (
        <>
            <Form.Control
                    type="number"
                    placeholder={placeholder}
                    name={name}
                    onBlur={handleInputChange}
                    required
                />
            {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
        </>
    );
}

export function InputText({ name, onChange, type='normal', placeholder }) {

    const [error, setError] = useState(null);

    function handleInputChange(e) {

        const name = e.target.getAttribute('name');
        let value = null;

        let nextError = "값을 입력해주세요.";
        setError();
        if(e.target.value !== null || e.target.value.length !== 0) {
            nextError = null;
        } 

        if(type === 'date') {
            value = formatDateToCustomFormat(e.target.value.toString());
            if(value === null) {
                e.target.value = '';
                nextError = "올바르지 않은 형식입니다.";
            } else {
            }
        } else {
            e.target.value = Math.max(0, e.target.value);
            value = Number(e.target.value);
        }

        setError(nextError);
        onChange({name: name, value: value});
    }

    return (
        <>
            <Form.Control
                    type="number"
                    placeholder={placeholder}
                    name={name}
                    onBlur={handleInputChange}
                    required
                />
            <p className="inputTypeError">{error}</p>
        </>
    );
}

export function InputNumberLoopSubItemWithFollowQuestions({ question, depth = 1, name, onChange, handleFollowUpQuestion, subQuestion, type, placeholder, unit, onChangedFamilyValue }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{question}</p>
                <InputTextWithFollowQuestions name={name} onChange={onChange} 
                    handleFollowUpQuestion={handleFollowUpQuestion} subQuestion={subQuestion} type={type} placeholder={placeholder} unit={unit} onChangedFamilyValue={onChangedFamilyValue} />
            </div>
        </>
    );
}

function InputTextWithFollowQuestions({ name, onChange, handleFollowUpQuestion, subQuestion, type='normal', placeholder, unit, onChangedFamilyValue }) {

    const [repeatCount, setRepeatCount] = useState(0);

    function handleInputChange(e) {

        const name = e.target.getAttribute('name');
        let value = e.target.value;

        if(type === 'date') {
            value = formatDateToCustomFormat(e.target.value.toString());
        } else {
            e.target.value = Math.max(0, e.target.value);
            value = Number(e.target.value);
        }

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
                    onBlur={handleInputChange}
                    required
                    onWheel={(e) => e.target.blur()} 
                />

            {Array.from({ length: repeatCount }).map((_, index) => (
            <div key={index}>
                {subQuestion({ 
                    onChangedInputValue: onChange, 
                    index: index,
                    onChangedFamilyValue: onChangedFamilyValue
                })}
            </div>
            ))}
        </>
    );
}

{/* yyyy-MM-dd 의 형식으로 반환 */}
export function formatDateToCustomFormat(dateString) {

    if (!/^\d{8}$/.test(dateString)) {
        return null;
    }

    const year = dateString.substring(0, 4); // yyyy
    const month = dateString.substring(4, 6); // MM
    const day = dateString.substring(6, 8); // dd

    const formattedValue = `${year}-${month}-${day}`;

    return formattedValue;
}
