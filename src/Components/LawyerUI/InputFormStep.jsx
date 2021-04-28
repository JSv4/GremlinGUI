import React from 'react';
import { 
    Segment, 
    Card
} from 'semantic-ui-react';
import Form from "@rjsf/semantic-ui";
import { LabelledFieldTemplate } from '../Shared/FormBuilder/CustomInputFields';
import {ArrayFieldTemplate} from '../Shared/FormBuilder/FormBuilder/ArrayFieldTemplate';


export const InputFormStep = (props) => {
    
    const {formData, input_schema_json, handleInputChange} = props;

    const widgets = {
        DateTimeWidget: LabelledFieldTemplate,
        DateWidget: LabelledFieldTemplate
      };

    return (
        <Segment style={{width:'100%', height:'100%', overflowY: 'scroll', backgroundColor:'#f3f4f5'}}>
            <Form
                schema={input_schema_json.schema}
                uiSchema={input_schema_json.uiSchema}
                onChange={(formData) => {
                    console.log("formData: ", formData.formData);
                    handleInputChange(formData.formData);
                }}
                formData={formData}
                widgets={widgets}
                ArrayFieldTemplate={ArrayFieldTemplate}
            >
                <></>
            </Form>
        </Segment>
    );
}