import { Form } from "react-bootstrap";
import { useState } from "react";

export function InputNumberItem({ question, name, onChange, type, placeholder, value, hasError }) {

    return (
        <>
            <div key={`-${question}`}>
                <p className="card-header-text">{question}</p>
                <InputText name={name} onChange={onChange} type={type} placeholder={placeholder} value={value} hasError={hasError} />
            </div>
        </>
    );
}

export function InputNumberSubItem({ question, depth = 1, name, onChange, type, placeholder, value, hasError }) {
    const marginClass = `ms-${depth * 1}`;

    return (
        <>
            <div key={`${question}`} style={{ backgroundColor: '#F6F6F6'}} className={marginClass}>
                <p className="card-header-text">{question}</p>
                <InputText name={name} onChange={onChange} type={type} placeholder={placeholder} value={value} hasError={hasError}/>
            </div>
        </>
    );
}

export function InputText({ name, onChange, type='normal', placeholder, value }) {

    const [error, setError] = useState('');

    function handleChange(e) {
        const name = e.target.getAttribute('name');
        const value = e.target.value;
        onChange({name: name, value: value});
    }

    function handleBlur(e) {

        const name = e.target.getAttribute('name');
        let value = null;

        let nextError = null;
        if(e.target.value === null || e.target.value.length === 0) {
            nextError = "값을 입력해주세요.";
        } else if(type === 'date') {
            value = formatDateToCustomFormat(e.target.value.toString());
            if(value === null) {
                e.target.value = '';
                nextError = "올바르지 않은 값입니다.";
            } else {
                onChange({name: name, value: value});
            }
        } else {
            let value = parseFloat(e.target.value);
            value = isNaN(value) || value < 0 ? 0 : value;
            
            onChange({name: name, value: value});
        }

        setError(nextError);
    }

    return (
        <>
            <Form.Control
                    type="text"
                    placeholder={placeholder}
                    name={name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={value || ''}
                    isInvalid={!!error}
                />
            <Form.Control.Feedback type="invalid">
            {error}
            </Form.Control.Feedback>
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

    if (month < 1 || month > 12) {
        return null;
      }
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) {
        return null;
      }

    const formattedValue = `${year}-${month}-${day}`;

    return formattedValue;
}
