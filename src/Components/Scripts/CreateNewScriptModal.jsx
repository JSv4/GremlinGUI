import React, {useState} from 'react';
import { Label, Icon, Modal, Segment, Button, Form, Dropdown } from 'semantic-ui-react';
import {job_script, doc_script} from '../Shared/Templates/ScriptTemplates';

function CreateNewScriptModal(props) {

  const [newName, setNewName] = useState("");
  const [scriptType, setScriptType] = useState('RUN_ON_JOB_DOCS_PARALLEL');

  const onAddClick = () => {
    props.handleCreate(newName, scriptType, scriptType === 'RUN_ON_JOB_DOCS_PARALLEL' ? doc_script : job_script );
    props.toggleModal();
  }

  return(
    <Modal open={props.visible} size = 'small'>
        <Label 
            corner='right'
            color='grey'
            icon='cancel'
            onClick={()=>props.toggleModal()}
        />
        <Modal.Header>Create New {props.objectType}</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Segment padded>
                    <Form>
                        <Form.Field onChange = {(data) => { setNewName(`${data.target.value}`)}}>
                            <label>{props.objectType} Name:</label>
                            <input placeholder={`Enter new ${props.objectType}...`} />
                        </Form.Field>
                        <Dropdown
                            options={[{key:1, text:'Run Once Per Job', value:'RUN_ON_JOB'},{key:2, text:'Run Once Per Doc', value:'RUN_ON_JOB_DOCS_PARALLEL'}]}
                            selection
                            onChange={
                                (e, data) => {
                                    setScriptType(data.value);
                                }
                            }
                            value={scriptType}
                        /> 
                    </Form>
                </Segment>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button color='green' onClick={() => onAddClick()}>
            <Icon name='checkmark' /> Create
            </Button>
            <Button color='grey' onClick={() => props.toggleModal()}>
            <Icon name='cancel' /> Cancel
            </Button>
        </Modal.Actions>
    </Modal>
  );
}

export default CreateNewScriptModal;

