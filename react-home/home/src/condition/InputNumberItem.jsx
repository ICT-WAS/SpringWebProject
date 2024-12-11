import { Form } from "react-bootstrap";
import { useState } from "react";

export function InputNumberItem({ number, question, name, onChange, type, placeholder }) {

    return (
        <>
            <div key={`${number}-${question}`}>
                <p className="card-header-text"><b className="px-2">{number.toString().padStart(2, '0')}</b>{question}</p>
                <InputText name={name} onChange={onChange} type={type} placeholder={placeholder} />
            </div>
        </>
    );
}

export function InputNumberSubItem({ number, question, depth = 1, name, onChange, type, placeholder }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number}.&nbsp;{question}</p>
                <InputText name={name} onChange={onChange} type={type} placeholder={placeholder} />
            </div>
        </>
    );
}

export function FamilyInputNumberSubItem({ code, number, question, depth = 1, name, onChangedFamilyValue, type, placeholder }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number}.&nbsp;{question}</p>
                <FamilyInputText code={code} name={name} onChangedFamilyValue={onChangedFamilyValue} type={type} placeholder={placeholder} />
            </div>
        </>
    );
}

function FamilyInputText({ code, index = 0, name, onChangedFamilyValue, type='normal', placeholder }) {

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

    const [hasError, setHasError] = useState(false);

    function handleInputChange(e) {

        const today = new Date();
        const formattedDate = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString();

        const name = e.target.getAttribute('name');
        let value = null;

        if(type === 'date') {
            value = formatDateToCustomFormat(e.target.value.toString());
            if(value == null) {
                e.target.value = '';
                setHasError(true);
            }
        } else {
            e.target.value = Math.max(0, e.target.value);
            value = Number(e.target.value);
        }

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
            {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
        </>
    );
}

export function InputNumberLoopSubItemWithFollowQuestions({ number, question, depth = 1, name, onChange, handleFollowUpQuestion, subQuestion, type, placeholder, unit, onChangedFamilyValue }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${number}-${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{number}.&nbsp;{question}</p>
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
                    onBlur={handleInputChange}
                    required
                    onWheel={(e) => e.target.blur()} 
                />

            {Array.from({ length: repeatCount }).map((_, index) => (
            <div key={index}>
                {subQuestion({ 
                    onChangedInputValue: onChange, 
                    childCount: index + 1,
                    onChangedFamilyValue: onChangedFamilyValue
                })}
            </div>
            ))}
        </>
    );
}

{/* yyyy-MM-dd 의 형식으로 반환 */}
function formatDateToCustomFormat(dateString) {

    if (!/^\d{8}$/.test(dateString)) {
        return null;
    }

    const year = dateString.substring(0, 4); // yyyy
    const month = dateString.substring(4, 6); // MM
    const day = dateString.substring(6, 8); // dd

    const formattedValue = `${year}-${day}-${month}`;

    return formattedValue;
}
