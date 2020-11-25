import React, {useState} from 'react'
import { Table, Label, Button, Statistic, Confirm } from 'semantic-ui-react'

const JobRow = (props) => {
    
    const [showConfirm, setShowConfirm] = useState(false);
    const {job} = props;

    if (!job) {
        return <Table.Row>Job Data Missing</Table.Row>;
    }

    function confirmDelete() {
        props.handleDeleteJob(props.job.id);
        setShowConfirm(false);
    }

    let startTime = "";
    let startDate = "N/A";
    if (job.start_time) {
        var dStart = new Date(job.start_time);
        startTime = dStart.toLocaleTimeString();
        startDate = dStart.toLocaleDateString();
    }
    let endTime = ""; 
    let endDate = "N/A";
    if (job.stop_time) {
        var dEnd = new Date(job.stop_time);
        endTime = dEnd.toLocaleTimeString();
        endDate = dEnd.toLocaleDateString()
    }

    // Build the array of action buttons
    let buttons = [<Button 
        key="job_row_button_0"
        icon='trash'
        basic
        circular
        color='red'
        onClick={() => setShowConfirm(!showConfirm)}
    />];
    if (props.job.finished && props.job.file) {
        buttons.push( 
            <Button 
                key={`job_row_button_${buttons.length+1}`}
                icon='save'
                basic
                circular
                color='grey'
                onClick={()=>{props.handleDownloadJob(props.job.id)}}
            />);
    }
    if (!props.job.queued && !props.job.started && !props.job.error && !props.job.finished) {
        buttons.push(
            <Button 
                key={`job_row_button_${buttons.length+1}`}
                icon='play circle outline'
                basic
                circular
                color='green'
                onClick={()=> {
                    let updatedObject = { id: props.job.id, queued: true };
                    props.handleUpdateJob(updatedObject);
                }}
            />
        );
    } 

    return (
    <Table.Row
        style={props.selected ? {backgroundColor: '#e2ffdb', overflowWrap:"break-word"} : {overflowWrap:"break-word"}}
    >
        <Confirm
          open={showConfirm}
          content="You have chosen to delete a job (which will delete all of its result and logs).
            ARE YOU SURE? This cannot be undone."
          confirmButton="DELETE"
          onCancel={() => setShowConfirm(!showConfirm)}
          onConfirm={() => confirmDelete()}
        />
        <Table.Cell 
            onClick={() => props.handleSelectJobRow()}
            style={{
                cursor:"pointer",
                color:"blue",
                textDecoration:"underline"
            }}>
                {props.job.name}
        </Table.Cell>
        {props.pipeline ? <Table.Cell 
            style={{
                cursor:"pointer",
                color:"blue",
                textDecoration:"underline"
            }}
            onClick={() => props.handleSelectPipeline(props.pipeline.id)}
            textAlign='center'>
            {props.pipeline.name}
        </Table.Cell> : <Table.Cell 
            textAlign='center'>
            NOT ASSIGNED
        </Table.Cell>}
        <Table.Cell textAlign='center'>
            <Statistic size='mini'>
                <Statistic.Value>{startDate} {startTime}</Statistic.Value>
            </Statistic>  
        </Table.Cell>
        <Table.Cell textAlign='center'>
            <Statistic size='mini'>
                <Statistic.Value>{endDate} {endTime}</Statistic.Value>
            </Statistic>  
        </Table.Cell>
        <Table.Cell textAlign='center'>
            <Statistic size='mini'>
                <Statistic.Value>{props.job.num_docs}</Statistic.Value>
            </Statistic>
        </Table.Cell>
        <Table.Cell textAlign='center'>
            {props.job.finished ? <Label color='green' key='grey' size='tiny'>Finished</Label> : <div/>}
            {props.job.error ? <Label color='red' key='red' size='tiny'>ERROR</Label> : <div/>}  
            {props.job.started && !props.job.finished ? <Label color='blue' key='grey' size='tiny'>Running...</Label> : <div/>}
            {props.job.queued & !props.job.started? <Label color='green' size='tiny'>Queued</Label> : <div/>}  
            {!props.job.queued & !props.job.started? <div><Label color='grey' size='tiny'>NOT Started</Label></div> : <div/>}
        </Table.Cell>
        <Table.Cell textAlign='center'>
            <div>
                { buttons }
            </div>
        </Table.Cell>
    </Table.Row>);
}

export default JobRow;