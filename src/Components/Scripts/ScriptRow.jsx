
import React, { useState } from 'react'
import { 
    Table,
    Button,
    Label,
    Image,
    Confirm } from 'semantic-ui-react'

function SupportedTypes (props) {
    try {
        let extensions = JSON.parse(props.extensions);
        return (extensions.map(ext => <Label color='grey' key={`${ext}`} size='tiny'>{ext}</Label>));
    } catch {
        return <Label color='red' size='tiny'>ERROR</Label>;
    }

}

const ScriptRow = (props) => {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <Table.Row
            style={props.selected ? {backgroundColor: '#e2ffdb', overflowWrap:"break-word"} : {overflowWrap:"break-word"}}
            textAlign='center'
        >
            <Confirm
                open={showDeleteConfirm}
                content="You have chosen to delete a script (which will delete any pipelines that depend on it).
                    ARE YOU SURE? This cannot be undone."
                confirmButton="DELETE"
                onCancel={() => setShowDeleteConfirm(!showDeleteConfirm)}
                onConfirm={() => props.onDelete(props.script.id)}
            />
            <Table.Cell 
                onClick={() => props.onClick()}
                style={{
                    cursor:"pointer",
                    color:"blue",
                    textDecoration:"underline"
                }}
                textAlign='left'>
                    {props.script.human_name}
            </Table.Cell>
            <Table.Cell> 
                {props.script.description ? props.script.description.substring(0,25) : "No Description..."}
            </Table.Cell>
            <Table.Cell>
                <div>
                    {props.script.type === "RUN_ON_JOB" ? <Image src='./serial_job.png' size='mini' /> : <Image src='./parallel_job.png' size='mini' />}
                </div>
            </Table.Cell>
            <Table.Cell>
                <SupportedTypes extensions={props.script.supported_file_types}/>
            </Table.Cell>
            <Table.Cell>
                {props.script.mode==='DEPLOYED' ? <Label color='green' size='tiny'>DEPLOYED</Label> : <Label color='yellow' size='tiny'>TEST</Label>}
            </Table.Cell>
            <Table.Cell>
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
                    onClick={() => props.onDownload(props.script.id)}
                />
            </Table.Cell>
        </Table.Row>
    );
}

export default ScriptRow;