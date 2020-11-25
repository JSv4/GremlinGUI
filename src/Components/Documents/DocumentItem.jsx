import React, { Component } from 'react'
import { Icon, List } from 'semantic-ui-react'

export default class DocumentItem extends Component {
    render() {  
        const {onDownload, onDelete, document} = this.props;
        return (
            <List.Item key={document.id}>
                <List.Icon 
                    name='file alternate'
                    size='large'
                    verticalAlign='middle'
                />
                <List.Content>
                        <List.Header as='a' onClick={() => onDownload(document.id)}>
                            {document.name} <Icon link name='help' color='red' onClick={()=>{onDelete(document.id)}}/>
                        </List.Header>
                        <List.Description>ID: {document.id} | Extracted: {`${document.extracted}`}</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}  