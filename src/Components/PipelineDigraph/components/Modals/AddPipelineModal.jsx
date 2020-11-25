import React, {useState} from 'react';
import { Label, Icon, Modal, Segment, Button, Form} from 'semantic-ui-react';

function AddPipelineModal(props) {

  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");

  const onAddClick = () => {
    props.handleCreatePipeline({name: newName, description});
    props.handleNewPipelineModalToggle();
  }

  return(
    <Modal open={props.visible} size = 'small'>
      <Label 
          corner='right'
          color='grey'
          icon='cancel'
          onClick={()=>props.toggleCreateModal()}
      />
      <Modal.Header>Create New Pipeline</Modal.Header>
      <Modal.Content>
        <Modal.Description>
            <Segment padded>
                <Form>
                    <Form.Field onChange = {(data) => { setNewName(`${data.target.value}`)}}>
                        <label>New Pipeline Name:</label>
                        <input placeholder='Enter new pipeline step name...' />
                    </Form.Field>
                    <Form.Field onChange = {(data) => { setDescription(`${data.target.value}`)}}>
                        <label>Description:</label>
                        <input placeholder='Please describe what this pipeline does...' />
                    </Form.Field>
                </Form>
            </Segment>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={() => onAddClick()}>
          <Icon name='checkmark' /> Create
        </Button>
        <Button color='grey' onClick={() => props.handleNewPipelineModalToggle()}>
          <Icon name='cancel' /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddPipelineModal;