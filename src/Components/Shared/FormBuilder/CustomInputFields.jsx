import React from 'react';
import { Form } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

// There appears to be a bug in react json form's semantic implementation where
// no label is rendered for the date field. Seems they are in process of fixing this as of 
// 4/23/21 but I want something that works now. Found a fix based on suggestion here: 
// https://github.com/rjsf-team/react-jsonschema-form/issues/1946
export const LabelledFieldTemplate = (props) => {

    console.log("LabelledFieldTemplate value: ", props.value);

    // Return with the label, if it's in a situation where it would be missing
    return (
        <Form.Field required={props.required}>
            <SemanticDatepicker 
                value={Date.parse(props.value)}
                required={props.required}
                label={props.schema.title}
                onChange={(event, data) => {
                    if (Date.parse(props.value) !== data.value) {
                        console.log("Data is: ", data);
                        console.log("Store date: ", data.value);
                        props.onChange(data.value.toString());
                    }                    
                }}
                style={{marginBottom:'1rem'}}
            />
        </Form.Field>
    );
};
