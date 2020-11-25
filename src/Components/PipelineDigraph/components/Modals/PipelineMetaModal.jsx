import React, {useState} from 'react';
import { Label, Icon, Modal, Segment, Button, Input, TextArea} from 'semantic-ui-react';

function PipelineMetaModel(props) {

    const { description, name, onChange, visible, toggleModal} = props;
    const [newDescription, setNewDescription] = useState(description);
    const [newName, setNewName] = useState(name);

    const onSaveClick = () => {
        onChange(newName, newDescription);
        toggleModal();
    }

    return(
        <Modal open={visible} size = 'small'>
        <Label 
            corner='right'
            color='grey'
            icon='cancel'
            onClick={()=>toggleModal()}
        />
        <Modal.Header>Edit Pipeline Name and Description</Modal.Header>
        <Modal.Content image>
            <Modal.Description>
                <Segment padded>
                    <Label attached='top'>Pipeline name:</Label>
                    <Input
                        fluid
                        value={newName}
                        onChange = {(data) => { setNewName(`${data.target.value}`)}}
                    />
                </Segment>
                <Segment padded>
                    <Label attached='top'>Description</Label>
                    <TextArea
                        style={{width:'100%'}}
                        rows={4}
                        value={newDescription}
                        onChange={(data) => { setNewDescription(`${data.target.value}`)}}
                    />
                </Segment>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button color='green' onClick={() => onSaveClick()}>
                <Icon name='checkmark' /> Save
            </Button>
            <Button color='grey' onClick={() => toggleModal()}>
                <Icon name='cancel' /> Cancel
            </Button>
        </Modal.Actions>
        </Modal>
    );
}

export default PipelineMetaModel;