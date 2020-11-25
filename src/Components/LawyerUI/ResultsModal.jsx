import React from 'react';
import { 
    Modal,
    Segment,
    Header,
    Label,
    Icon,
    Grid,
    Divider,
    Button,
    Message
} from 'semantic-ui-react';
import Circle from 'react-circle';
import { CenteredIconDiv } from '../Layouts/Layouts';

export const JobResult = (props) => {
    
    const {job, handleDownloadJob} = props;

    if (job && job.file) {
        return(
            <div>
                <Header icon>
                    <Icon name='file text' />
                    Download Job Results 
                </Header>
                <Button onClick={() => handleDownloadJob(job.id)} primary>Download</Button>
            </div>
        );
    }
    else {
        return (
            <div>
                <Header icon>
                    <Icon name='x' />
                    No Results...
                </Header>
                <Button primary disabled>Download</Button>
            </div>
        );
    }
}

export const ResultsModal = (props) => {

    const { visible, toggleModal, handleUpdateJob, selectedJob } = props;

    if (!selectedJob) {
        return <></>;
    }

    return (  
        <Modal
            open={visible}
        >
            <Label
                    corner='right' 
                    icon='x'
                    onClick={toggleModal}
                />
            <Modal.Content>
                <Segment placeholder>
                    <Grid columns={2} stackable textAlign='center'>
                        <Divider vertical>Result:</Divider>
                        <Grid.Row verticalAlign='middle'>
                            <Grid.Column>
                                <Grid>
                                    <Grid.Row stretched>
                                        <Grid.Column stretched>
                                            <Header textAlign='center' as='h2'>
                                                <Header.Content>
                                                    { selectedJob.name }
                                                    <Header.Subheader>({selectedJob.pipeline.name})</Header.Subheader>
                                                </Header.Content>
                                            </Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row stretched>
                                        <Grid.Column stretched textAlign='center'>
                                        {
                                            selectedJob.started ? (
                                                <>
                                                    <Header textAlign='center' as='h5'>Progress:</Header>
                                                    { selectedJob.error ?
                                                        <CenteredIconDiv
                                                            icon='warning sign'
                                                            size='huge'
                                                            color='red'
                                                            header='ERROR'
                                                            subheader='See status'
                                                        /> :
                                                        <div>
                                                            <Circle 
                                                                style={{textAlign:"center"}}
                                                                progress={(100 * selectedJob.completed_tasks/selectedJob.task_count).toFixed(2)}
                                                            />
                                                        </div> 
                                                    }
                                                </>
                                            ) : (
                                                <div style={{margin:'auto'}} onClick={() => {
                                                    let updatedObject = {...selectedJob};
                                                    updatedObject.queued = true;
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
                                            {selectedJob.queued ? <Label color='green' size='tiny'>Queued</Label> : <div/>}  
                                            {selectedJob.started & !selectedJob.finished ? <Label color='blue' size='tiny'>Running...</Label> : <div/>}
                                            {selectedJob.error ? <Label color='red' size='tiny'>ERROR</Label> : <div/>}  
                                            {selectedJob.finished ? <Label color='green' size='tiny'>Finished</Label> : <div/>}  
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <Header textAlign='center' as='h5'>Notified Email:</Header>
                                            {selectedJob.notification_email ? 
                                                <Label color='green' size='tiny'>{selectedJob.notification_email}</Label> : 
                                                <Label color='grey' size='tiny'>N/A</Label>}  
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row stretched>
                                        <Grid.Column stretched textAlign='center'>
                                            <Message size='tiny' style={{overflowWrap:"break-word"}}>
                                                <Message.Content>
                                                <Message.Header as='h6'>State:</Message.Header>
                                                    {selectedJob.status}
                                                </Message.Content>
                                            </Message>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid> 
                            </Grid.Column>
                            <Grid.Column>
                                <JobResult job={selectedJob} handleDownloadJob={props.handleDownloadJob}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Modal.Content>
        </Modal>
    );
}  