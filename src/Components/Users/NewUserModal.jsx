import React, {Component} from 'react';
import { 
    Label,
    Modal,
    Button,
} from 'semantic-ui-react';
import {
    newUserForm_Schema,
    newUserForm_Ui_Schema,
} from '../Forms/FormSchemas';
import { 
    validateNewUserForm
} from '../Forms/Validators';
import Form from "@rjsf/semantic-ui";

//This is a pop-up modal that lets you create a new job.
export default class NewUserModal extends Component {

    constructor(props) {
        super(props);
        this.state={
            username:"",
            email:"",
            name:"",
            role:"LAWYER"
        };
    }

    handleChange = ({formData}) => {
        console.log(`update`, formData);
        this.setState(formData);
    }

    handleSubmit = () => {
        const state = this.state;
        this.props.handleInviteUser(state);
        console.log("Submit values: ", state);
    }

    render() {

        const { toggle, visible } = this.props;

        return(
            <Modal open={visible} size = 'small'>
                <Label 
                    corner='right'
                    color='grey'
                    icon='cancel'
                    onClick={()=>toggle()}
                />
                <Modal.Content>
                    <Form 
                        schema={newUserForm_Schema}
                        uiSchema={newUserForm_Ui_Schema}
                        validate={validateNewUserForm}
                        onChange={this.handleChange}
                        formData={this.state}
                    >
                        <Button color='blue' onClick={this.handleSubmit}>Submit</Button>
                    </Form>
                </Modal.Content>
            </Modal>
          );
    }
}
