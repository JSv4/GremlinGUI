import React from 'react';
import { 
    Segment,
    Button,
    Form,
    Icon,
    Label,
    Grid,
    Header, 
    Message,
    Menu
} from 'semantic-ui-react';
import Circle from 'react-circle';

import { SidebarLoadingPlaceholder } from './Placeholders';


export const CreateAndSearchBar = (props) => {

    const { onChange, onCreate, onImport, onSubmit, placeholder, value } = props;

    let buttongroup = <></>;
    let buttons = [
        (<Button
            key='create_new_button'
            positive
            onClick={onCreate}
        >
            Create New
        </Button>)
    ];

    if (onImport) {
        buttons.push(<Button.Or key='create_and_search_button_or'/>);
        buttons.push(
        <Button
            key='import_type_button'
            onClick={onImport}
        >
            Import New
        </Button>);
    }

    buttongroup =  (
        <Button.Group floated='right' style={{marginRight:'10px'}} >
            {buttons}
        </Button.Group>
    );

    return (<Segment raised>
        <div style={{
            height: '100%',
            display:'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <div style={{width:'25vw'}}>
                <Form onSubmit={onSubmit}>
                    <Form.Input
                        icon='search'
                        placeholder={placeholder}
                        onChange={(data)=> onChange(data.target.value)}
                        value={value}
                    />
                </Form>
            </div>
            <div>
                {buttongroup}
            </div>
        </div>
    </Segment>);
}

export const JobDigraphButtonPanel = (props) => {

    const { digraphEngine } = props;

    return (
        <Menu icon>
            <Menu.Item
                name='zoom_in'
                onClick={(e)=> {
                    e.stopPropagation();
                    digraphEngine.zoomIn();
                }}
            >
                <Icon name='zoom-in' size='large'/>
            </Menu.Item>
            <Menu.Item
                name='zoom_out'
                onClick={(e)=> {
                    e.stopPropagation();
                    digraphEngine.zoomOut();
                }}
            >
                <Icon name='zoom-out' size='large'/>
            </Menu.Item>
            <Menu.Item
                name='zoom_fit'
                onClick={(e)=> {
                    e.stopPropagation();
                    digraphEngine.zoomToFit();
                }}
            >
                <Icon name='compress' size='large'/>
            </Menu.Item>
      </Menu>
    );
};

export const JobControl = (props) => {

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

    if (completion_percent) {
        completion = (100 * completion_percent).toFixed(2)
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

export const JobStatusCol = (props) => {

    const {
        job,
        pipeline,
        handleUpdateJob, 
        style,
        completion_percent
    } = props;

    return ( 
        <Segment style={style}>
            {job ? 
                <JobControl
                    job={job}
                    pipeline={pipeline}
                    handleUpdateJob={handleUpdateJob}
                    completion_percent={completion_percent}
                />
                :
                <SidebarLoadingPlaceholder LoadingText='Creating Test Job...'/>
            }
        </Segment> 
       
                    
    );
}  
