import React, {useState} from 'react';
import { Label, Icon, Modal, Segment, Button, Form} from 'semantic-ui-react';

function CreateNewModal(props) {

  const [newName, setNewName] = useState("");

  const onAddClick = () => {
    props.handleCreate(newName);
    props.handleNewScriptModalToggle();
  }

  return(
    <Modal open={props.visible} size = 'small'>
        <Label 
            corner='right'
            color='grey'
            icon='cancel'
            onClick={()=>props.handleNewScriptModalToggle()}
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
                    </Form>
                </Segment>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button color='green' onClick={() => onAddClick()}>
            <Icon name='checkmark' /> Create
            </Button>
            <Button color='grey' onClick={() => props.handleNewScriptModalToggle()}>
            <Icon name='cancel' /> Cancel
            </Button>
        </Modal.Actions>
    </Modal>
  );
}

export default CreateNewModal;

