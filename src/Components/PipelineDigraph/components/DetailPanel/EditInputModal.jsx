

import React, { Component } from 'react';
import {
    Modal,
    Button
} from 'semantic-ui-react';
import JsonSchemaFormEditor from '../../../Shared/FormBuilder/JsonSchemaFormSuite';
 
class EditInputModal extends Component {

constructor(props) {
    super(props);

    let schema = '';
    let uischema = '';

    try {
        schema = props.schema.schema;
        uischema = props.schema.uischema;
    } catch(e) {}

    this.state = {
        schema: schema,
        uischema: uischema
    };
  }

  render() {

    const { open, setOpen, saveSchema } = this.props;

    return (
        <Modal
            closeIcon
            open={open}
            onClose={() => setOpen(false)}
        >
            <Modal.Header>Edit Input Form</Modal.Header>
            <Modal.Content style={{overflowY:'scroll'}}>
                <JsonSchemaFormEditor
                 schema={this.state.schema}
                 uischema={this.state.uischema}
                 onChange={(newSchema, newUiSchema) => {
                     this.setState({
                         schema: newSchema,
                         uischema: newUiSchema
                     });
                 }}
                />
            </Modal.Content>
            <Modal.Actions>
            <Button negative onClick={() => setOpen(false)}>
                Close
            </Button>
            <Button positive onClick={() => saveSchema(this.state)}>
                Save
            </Button>
            </Modal.Actions>
        </Modal>      
    );
  }
}

export default EditInputModal;