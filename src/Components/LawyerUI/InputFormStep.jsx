import React from 'react';
import { 
    Segment
} from 'semantic-ui-react';
import Form from "@rjsf/semantic-ui";

export const InputFormStep = (props) => {
    
    const {formData, input_schema_json, handleInputChange} = props;

    return (
        <Segment style={{width:'100%', height:'100%', overflowY: 'scroll', backgroundColor:'#f3f4f5'}}>
            <Form
                schema={input_schema_json.schema}
                uiSchema={input_schema_json.uiSchema}
                onChange={(formData) => handleInputChange(formData.formData)}
                formData={formData}
                submitButtonMessage={'Submit'} 
            >
                <></>
            </Form>
        </Segment>
    );
}