import React from 'react';
import { 
    Table,
    Segment
} from 'semantic-ui-react';

export const ScriptTable = (props) => {
    return (
        <Segment raised style={{
            padding:'0px',
            height:'70vh',
            overflow:'scroll'
        }}>
            <Table selectable structured size='small'>
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Doc Types</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.children}
                </Table.Body>
            </Table>
        </Segment>);
}