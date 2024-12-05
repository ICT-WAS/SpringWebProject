import React from "react";
import { Form } from "react-bootstrap";

export default function RadioButtonItem({buttons, flexAuto}) {

    const flexValue = flexAuto ? 1 : 'none';
    
    return buttons.values.map((button, index) =>
        <React.Fragment key={`buttons-${index}`}>
            <Form.Check 
                type={'radio'} 
                name={buttons.name}
                label={button.value}
                style={{flex: `${flexValue}`}}
            />
        </React.Fragment>
    );
}

RadioButtonItem.defaultProps = {
    flexAuto: true,
  };