import React, { useState } from 'react'
import { 
    Table,
    Button,
    Label,
    Confirm
 } from 'semantic-ui-react'
 //import SupportedFileTypes from '../../../Shared/SupportedFileTypes';

const PipelineRow = (props) => {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

     // Parse the file type json from the string stored in the db
     let fileTypes = [];
     try {
        fileTypes = JSON.parse(props.pipeline.supported_files).supported_files;
     } catch (e) {}

     return (
        <Table.Row
            style={props.selected ? {backgroundColor: '#e2ffdb', overflowWrap:"break-word"} : {overflowWrap:"break-word"}}
        >
            <Confirm
                header="Delete this pipeline?"
                content="Are you sure you want to delete this pipeline? The scripts will not be deleted, but your pipeline steps and settings will be!"
                open={showDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(!showDeleteConfirm)}
                onConfirm={() => props.onDelete(props.pipeline.id)}
            />
            <Table.Cell 
                onClick={() => props.onClick()}
                style={{
                    cursor:"pointer",
                    color:"blue",
                    textDecoration:"underline"
                }}>
                    {props.pipeline.name}
            </Table.Cell>
            <Table.Cell> 
                {props.pipeline.description ? props.pipeline.description.substring(0,25) : "No Description..."}
            </Table.Cell>
            <Table.Cell textAlign='center'>
                { props.pipeline.production ? <Label color='green' size='tiny'>PRODUCTION</Label> :
                <Label color='red' size='tiny'>TESTING</Label>}
            </Table.Cell>
            <Table.Cell textAlign='center'>
                {/* <SupportedFileTypes extensions={fileTypes}/> */}
            </Table.Cell>
            <Table.Cell textAlign='center'>
                <Button
                    basic
                    circular
                    color='red'
                    icon='trash'
                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                />
                <Button
                    basic
                    circular
                    color='green'
                    icon='download'
                    onClick={() => props.handleDownloadPipeline(props.pipeline.id)}
                />
            </Table.Cell>
        </Table.Row>
     );
}

export default PipelineRow;