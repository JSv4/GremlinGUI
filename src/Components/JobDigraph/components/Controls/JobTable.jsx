import React from 'react';
import { 
    Table,
    Segment,
    Dimmer,
    Loader
} from 'semantic-ui-react';

export const JobTable = (props) => {
    return (
        <Segment raised style={{
            padding:'0px',
            height:'60vh',
            overflow:'scroll'
        }}>
            { props.loading ? <Dimmer active inverted>
                <Loader inverted>Loading scripts...</Loader>
            </Dimmer> : <></> }
            <Table selectable structured size='small'>
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
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