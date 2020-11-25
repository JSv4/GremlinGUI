import React, {useState} from 'react';
import {
    Grid, 
    Segment,
    Statistic,
    Label,
    Button,
    Image, 
    Header,
    Accordion,
    Icon
} from 'semantic-ui-react';
import { JobStatusLabels } from './StatusLabels';
import JobSettings from './JobSettings';
import { DocumentList } from '../Documents/DocumentList';


export function SummaryJobResultStats(props) {
    
    const {
        selectedJob,
        style
    } = props;

    return (
        <div style={{ width: '100%', height: '100%', ...style, }}>
            <Segment style={{width:'100%', height:'100%'}}>
                <Grid centered stretched verticalAlign='middle'>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column width={4}>
                            <Statistic size='tiny'>
                                <Statistic.Value>
                                    <Icon name='hashtag' />{selectedJob.id}
                                </Statistic.Value>
                                <Statistic.Label>ID</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='center'>
                            <Header textAlign='center' as='h5' style={{margin:'0px', marginBottom:'5px'}}>Status:</Header>
                            <JobStatusLabels job={selectedJob}/>  
                        </Grid.Column>
                        <Grid.Column width={8} textAlign='center'>
                            <Header textAlign='center' as='h5' style={{margin:'0px', marginBottom:'5px'}}>Email Notification:</Header>
                            {selectedJob.notification_email ? 
                                <Label color='green' size='mini'>{selectedJob.notification_email}</Label> : 
                                <Label color='grey' size='mini'>None Provided</Label>}  
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    )
}

export function DateTimeStats(props) {
    
    const {
        label, 
        dateString,
        timeString,
        style
    } = props;

    return (
        <Segment
            textAlign='center'
            style={style}
        >
            <Label attached='top'>{label}</Label>
            <Grid stretched>
                <Grid.Row>
                    <Grid.Column>
                        <div style={{textAlign:'center'}}>
                            <Statistic size='mini'>
                                <Statistic.Value>{timeString}</Statistic.Value>
                                <Statistic.Label>{label} Time</Statistic.Label>
                            </Statistic>
                        </div> 
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <div style={{textAlign:'center'}}>
                            <Statistic size='mini'>
                                <Statistic.Value>{dateString}</Statistic.Value>
                                <Statistic.Label>{label} Date</Statistic.Label>
                            </Statistic>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
}

export function JobResultStats(props) {
    
    const {
        selectedJob,
        startTime,
        startDate,
        endTime,
        endDate,
        toggleDeleteConfirm,
        handleDownloadJob,
        loadAndShowLog,
        style
    } = props;

    return (
        <Grid stretched style={style}>
            <Grid.Row>
                <Grid.Column width={16}>
                    <SummaryJobResultStats 
                        selectedJob={selectedJob}
                    />    
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8}>
                    <DateTimeStats
                        label="Start"
                        timeString={startTime}
                        dateString={startDate}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <DateTimeStats
                        label="End"
                        timeString={endTime}
                        dateString={endDate}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <div textAlign='right'>
                        <Button 
                            circular
                            color='red'
                            icon='trash'
                            onClick={() => toggleDeleteConfirm()}
                        />
                        { selectedJob.file ? 
                        <Button
                            circular
                            color='green'
                            icon='save'
                            onClick={( )=> handleDownloadJob(selectedJob.id)}
                        /> : <></>}
                        {loadAndShowLog ? <Button 
                            circular
                            color='teal'
                            icon='terminal'
                            onClick={() => loadAndShowLog()}
                        /> : <></>}
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export function StartStopStats(props) {
    
    const {
        startDate,
        startTime,
        endDate,
        endTime,
        style
    } = props;
    
    return (
        <Grid stretched style={style}>
            <Grid.Row>
                <Grid.Column width={8}>
                    <DateTimeStats
                        label="Start"
                        dateString={startDate}
                        timeString={startTime}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <DateTimeStats
                        label="End"
                        dateString={endDate}
                        timeString={endTime}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export function NodeResultActions(props) {

    const {
        result,
        toggleDeleteConfirm,
        handleDownloadResult, 
        loadAndShowLog,
        style
    } = props;

    let Buttons = [];

    if (toggleDeleteConfirm) {
        Buttons.push(
            <Button 
                key='1'
                circular
                color='red'
                icon='trash'
                onClick={() => toggleDeleteConfirm()}
            />
        );
    }
    if (result && result.has_file) {
        Buttons.push(
            <Button
                key='2'
                circular
                color='green'
                icon='save'
                onClick={()=> handleDownloadResult(result.id)}
            />
        );
    }
    Buttons.push(
        <Button 
            key='3'
            circular
            color='teal'
            icon='terminal'
            onClick={() =>  loadAndShowLog(result.job, result.pipeline_node)}
        />
    );

    return (
        <div style={style}>
            {Buttons}
        </div>
    );
}

export function PipelinePanelHeader(props) {

    const {selectedPipeline} = props;

    if (!selectedPipeline) return <></>;

    return (
        <Segment style={{width: '100%', wordWrap: 'break-word'}}>
             <div style={{width: '100%', height: '100%', display:'flex', flexDirection:'row', justifyContent:'space-evenly', alignItems: 'center'}}>
                    <div>
                        <Statistic size='small' style={{marginRight:'1vw'}}>
                            <Statistic.Value>
                                <Icon size='small' name='code branch'/>
                            </Statistic.Value>
                            <Statistic.Label>PIPE</Statistic.Label>
                        </Statistic>
                    </div>
                    <div>
                        <Header as='h3'>
                            <Header.Content>
                            {selectedPipeline.name} (ID #{selectedPipeline.id})
                            <Header.Subheader>Production: {selectedPipeline.production ? "True" : "False"}</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </div> 
        </Segment>
    );

}

export function NodePanelHeader(props) {

    const {selectedNode, script} = props;

    if (!selectedNode) return <></>;

    return (
        <Segment style={{width: '100%', wordWrap: 'break-word'}}>
             <div style={{width: '100%', height: '100%', display:'flex', flexDirection:'row', justifyContent:'space-evenly', alignItems: 'center'}}>
                    <div>
                        <Statistic size='small' style={{marginRight:'1vw'}}>
                            <Statistic.Value>
                                <Image size='mini' src='./node_icon.png'/>
                            </Statistic.Value>
                            <Statistic.Label>NODE</Statistic.Label>
                        </Statistic>
                    </div>
                    <div>
                        <Header as='h3'>
                            <Header.Content>
                            {selectedNode.name} (ID #{selectedNode.id})
                            <Header.Subheader>Script: {script ? script.human_name : ""}</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </div> 
        </Segment>
    );

}

export function JobPanelHeader(props) {

    const {selectedJob} = props;

    if (!selectedJob) return <></>;

    return (
        <Segment style={{width: '100%', wordWrap: 'break-word'}}>
             <div style={{width: '100%', height: '100%', display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems: 'center'}}>
                    <div>
                        <Statistic size='small'>
                            <Statistic.Value>
                                <Icon name='briefcase'/>
                            </Statistic.Value>
                            <Statistic.Label>JOB</Statistic.Label>
                        </Statistic>
                    </div>
                    <div>
                        <Header as='h3'>
                            <Header.Content>
                            {selectedJob.name} (ID #{selectedJob.id})
                            <Header.Subheader>Pipeline: {selectedJob.pipeline ? selectedJob.pipeline.name : ""}</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </div>
                </div> 
        </Segment>
    );

}

export function SummaryNodeResultStats(props) {

    const {
        result,
        imageUrl,
        script,
        handleScriptSelect,
        style
    } = props;

    return (
        <div style={{ width: '100%', ...style, }}>
            <Segment style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                    <Statistic size='mini'>
                        <Statistic.Value>
                            <Icon name='hashtag' />{result.id}
                        </Statistic.Value>
                        <Statistic.Label>ID</Statistic.Label>
                    </Statistic>
                </div>
                <div>
                    <Statistic size='mini'>
                        <Statistic.Value>
                            <Image size='tiny' src={imageUrl}/>
                        </Statistic.Value>
                        <Statistic.Label>Type</Statistic.Label>
                    </Statistic>
                </div>         
                <div style={{textAlign:'center', wordBreak:'break-all'}}>
                    { script ? 
                        <Statistic size='mini'>
                            <Statistic.Value>
                                <span 
                                    style={{cursor:"pointer", color:"blue", textDecoration:"underline"}}
                                    onClick={() => handleScriptSelect(script.id)}
                                >
                                    { script.human_name }
                                </span>
                            </Statistic.Value>
                            <Statistic.Label>Script</Statistic.Label> 
                        </Statistic>:
                        <Statistic size='mini'>
                            <Statistic.Value>
                                <span>None</span>
                            </Statistic.Value>
                            <Statistic.Label>Script</Statistic.Label> 
                        </Statistic> }
                </div>  
            </Segment>
        </div>
    );
}

export function NodeResultStats(props) {

    const {
        result,
        imageUrl,
        script,
        startTime,
        startDate,
        endTime,
        endDate,
        toggleDeleteConfirm,
        handleDownloadResult,
        handleScriptSelect,
        loadAndShowLog,
        style
    } = props;

    return (
        <Grid stretched style={style}>
            <Grid.Row>
                <Grid.Column width={16}>
                    <SummaryNodeResultStats
                        result={result}
                        imageUrl={imageUrl}
                        script={script}
                        handleScriptSelect = {handleScriptSelect}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8}>
                    <DateTimeStats
                        label="Start"
                        dateString={startDate}
                        timeString={startTime}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <DateTimeStats
                        label="End"
                        dateString={endDate}
                        timeString={endTime}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                     <NodeResultActions
                        result={result}
                        toggleDeleteConfirm = { toggleDeleteConfirm }
                        handleDownloadResult = { handleDownloadResult }
                        loadAndShowLog = { loadAndShowLog }
                     />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

}

export function JobInputs(props) {
    
    const {
        job,
        jobSettings,
        handleUpdateTestJob,
        style
    } = props;
    
    return (
        <Segment style={style}>
            <Header as='h3'>Initial Data Input:</Header>
            <JobSettings
                job={job}
                jobSettings={jobSettings}
                handleUpdateJob={handleUpdateTestJob}
            />
        </Segment>
    );
}

export function DataInputPane(props) {
    const [visible, setVisible] = useState(false);

    const {
        job,
        jobSettingsJson, 
        handleUpdateJob,
    } = props;

    return (
        <div>
            <Accordion fluid styled>
                <Accordion.Title
                active={visible}
                index={0}
                onClick={() => setVisible(!visible)}
                >
                    <Icon name='dropdown' />
                    Adjust Job Inputs
                </Accordion.Title>
                <Accordion.Content active={visible}>
                    <JobSettings
                        job={job}
                        jobSettings={jobSettingsJson}
                        handleUpdateJob={handleUpdateJob}
                    />
                </Accordion.Content>
            </Accordion> 
        </div>
    );

}

export function DocumentInputPane(props) {

    const [visible, setVisible] = useState(false);

    const {
        documents,
        handleDocumentDelete,
        handleUploadDocument,
        handleDocumentPageChange
    } = props;

    return (
        <div>   
            <DocumentList
                documents={documents.items}
                page={documents.selectedPage}
                pages={documents.pages}
                onDelete={handleDocumentDelete}
                onUpload={handleUploadDocument}
                handleSelectDocumentPage={handleDocumentPageChange} 
            />
        </div>
    );
}