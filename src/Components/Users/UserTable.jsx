import React from 'react';
import { 
    Table,
    Segment
} from 'semantic-ui-react';

export const UserTable = (props) => {
    return (
        <Segment raised style={{
            padding:'0px',
            height:'60vh',
            overflow:'scroll'
        }}>
            <Table selectable structured size='small'>
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>E-mail</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.children}
                </Table.Body>
            </Table>
        </Segment>);
}