import React from 'react';
import { 
    Segment
} from 'semantic-ui-react';
import {
    newJob_Schema,
    newJob_Ui_Schema,
} from '../Forms/FormSchemas';
import Form from "@rjsf/semantic-ui";

export const JobDetailsStep = (props) => {
    
    const {name, notification_email, handleJobFormChange} = props;

    return (
        <Segment style={{width:'100%', height:'100%', overflowY: 'scroll', backgroundColor:'#f3f4f5'}}>
            <Form 
                schema={newJob_Schema}
                uiSchema={newJob_Ui_Schema}
                onChange={(args) => handleJobFormChange(args.formData)}
                formData={{name, notification_email}}
            >
                <></>
            </Form>
        </Segment>
    );
}