import React from "react";
import { Form } from "react-bootstrap";

export default function RadioButtonItem({buttons, flexAuto = true, onChange}) {

    const flexValue = flexAuto ? 1 : 'none';

    function handleRadioChange(e) {
        const name = e.target.getAttribute('name');
        const value = e.target.getAttribute('id');
        onChange({name: name, value: value});
    }

    return buttons.values.map((button, index) =>
        <React.Fragment key={`buttons-${index}`}>
            <Form.Check 
                type={'radio'} 
                name={buttons.name}
                label={button.value}
                id={button.value}
                style={{flex: `${flexValue}`}}
                onChange={handleRadioChange}
            />
        </React.Fragment>
    );
}