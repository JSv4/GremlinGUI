import React from 'react';
import { Message, Modal, Label, Icon, Segment } from 'semantic-ui-react';
import { LazyLog } from 'react-lazylog';

function LogModal(props) {
    return (
            <Modal open={props.visible}>
                <Label 
                    corner='right'
                    color='grey'
                    icon='cancel'
                    onClick={()=> props.handleModalToggle()}
                />
                <Modal.Content>   
                    <Modal.Header as="h3">Pipeline System Logs:</Modal.Header> 
                    <Segment>
                        {props.loading ? 
                        <Message icon>
                            <Icon name='circle notched' loading />
                            <Message.Content>
                                <Message.Header>Just one second</Message.Header>
                                Fetching logs for you...
                            </Message.Content>
                        </Message> :
                        <LazyLog 
                            extraLines={1}
                            enableSearch
                            text={props.log ? props.log : "No logs..."}
                            height={400}
                            follow
                            caseInsensitive />}
                    </Segment>  
                </Modal.Content>
            </Modal>);
}

export default LogModal;