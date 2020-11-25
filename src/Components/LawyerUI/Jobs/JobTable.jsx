import React from 'react';
import { 
    Table,
    Segment,
} from 'semantic-ui-react';

export const JobTable = (props) => {
    return (
        <Segment style={{minHeight: 300}}>
        <Table selectable celled structured size='small'>
            <Table.Header>
                <Table.Row textAlign='center'>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Pipeline</Table.HeaderCell>
                    <Table.HeaderCell>Progress</Table.HeaderCell>
                    <Table.HeaderCell>Start Time</Table.HeaderCell>
                    <Table.HeaderCell>End Time</Table.HeaderCell>
                    <Table.HeaderCell>Num Docs</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.children}
            </Table.Body>
        </Table>
    </Segment>);
}