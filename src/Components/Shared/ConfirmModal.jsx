import React from 'react';
import { Label, Icon, Modal, Header, Button } from 'semantic-ui-react';

function ConfirmModal(props) {

  const onYesClick = () => {
    props.yesAction();
    props.toggleModal();
  }

  const onNoClick = () => {
    props.noAction();
    props.toggleModal();
  }

  return(
    <Modal open={props.visible} basic size = 'small'>
        <Label 
            corner='right'
            color='grey'
            icon='cancel'
            onClick={()=>props.toggleModal()}
        />
        <Header icon='exclamation circle' content='ARE YOU SURE?' /> 
        <Modal.Content>
            <p>
                {props.message}
            </p>
        </Modal.Content>        
        <Modal.Actions>
            <Button basic color='red' inverted onClick={() => onNoClick()}>
                <Icon name='remove' /> No
            </Button>
            <Button color='green' inverted onClick={() => onYesClick()}>
                <Icon name='checkmark' /> Yes
            </Button>
        </Modal.Actions>
    </Modal>
  );
}

export default ConfirmModal;

