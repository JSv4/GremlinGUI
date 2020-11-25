import React, {useState} from 'react';
import { Label, Icon, Modal, Segment, Button, Input} from 'semantic-ui-react';

export function NewNodeNameModel(props) {

    const { selectedNode, onChange, visible, toggleModal } = props;
    const [newName, setNewName] = useState("");
    
    console.log("selectedNode:", selectedNode);

    const onSaveClick = () => {
        let updateObj = {
            id: selectedNode.id,
            name: newName
        };
        onChange(updateObj);
        // () => saveAndClose("Solve me later", selectedNode, {})
        toggleModal();
    }

    return(
        <Modal open={visible} size = 'small' style={{zIndex: 1000}}>
            <Label 
                corner='right'
                color='grey'
                icon='cancel'
                onClick={()=>toggleModal()}
            />
            <Modal.Header>Give Your Node a Nickname...</Modal.Header>
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
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' onClick={() => onSaveClick()}>
                    <Icon name='checkmark' /> Create Node
                </Button>
                <Button color='grey' onClick={() => toggleModal()}>
                    <Icon name='cancel' /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

