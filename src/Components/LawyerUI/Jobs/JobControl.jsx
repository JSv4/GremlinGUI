import React from 'react';
import { Grid, Header, Icon, Label, Message } from 'semantic-ui-react';
import Circle from 'react-circle';

// TODO - duplicate of component in Controls.jsx
export function JobControl(props) {

    const {
        job,
        pipeline,
        handleUpdateJob, 
        completion_percent
    } = props;

    if (!job) {
        return <></>;
    }

    let completion = 0;
    if (completion_percent>0) {
        completion = (100 * completion_percent).toFixed(2);
    } else {
        completion = (100 * job.completed_tasks/job.task_count).toFixed(2);
    }

    return ( 
        <Grid>
            <Grid.Row stretched>
                <Grid.Column stretched>
                    <Header textAlign='center' as='h2'>
                        <Header.Content>
                            { job ? job.name : "[JOB NAME]"}
                            <Header.Subheader>({pipeline ? pipeline.name : "[PIPELINE NAME]"})</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
                <Grid.Column stretched textAlign='center'>
                {
                    job.started ? (
                        <div>
                            <Header textAlign='center' as='h5'>Progress:</Header>
                            <Circle 
                                style={{textAlign:"center"}}
                                progress={completion}
                            />
                        </div>
                    ) : (
                        <div style={{margin:'auto'}} onClick={() => {
                            let updatedObject = {id: job.id, queued: true};
                            handleUpdateJob(updatedObject);
                        }}>
                            <Header textAlign='center' as='h4' style={{cursor: 'pointer'}}>
                                <Icon size='big' style={{margin: 'auto'}} name='video play'/>
                                Start
                            </Header>   
                        </div>
                    )
                }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column textAlign='center'>
                    <Header textAlign='center' as='h5'>Status:</Header>
                    
                    {job.queued ? <Label color='green' size='tiny'>Queued</Label> : <div/>}  
                    {job.started & !job.finished ? <Label color='blue' size='tiny'>Running...</Label> : <div/>}
                    {job.error ? <Label color='red' size='tiny'>ERROR</Label> : <div/>}  
                    {job.finished ? <Label color='green' size='tiny'>Finished</Label> : <div/>}  
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Header textAlign='center' as='h5'>Notified Email:</Header>
                    {job.notification_email ? 
                        <Label color='green' size='tiny'>{job.notification_email}</Label> : 
                        <Label color='grey' size='tiny'>None Provided</Label>}  
                </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
                <Grid.Column stretched textAlign='center'>
                    <Message size='tiny' style={{overflowWrap:"break-word"}}>
                        <Message.Content>
                        <Message.Header as='h6'>State:</Message.Header>
                            {job.status}
                        </Message.Content>
                    </Message>
                </Grid.Column>
            </Grid.Row>
        </Grid>                
    );
}  