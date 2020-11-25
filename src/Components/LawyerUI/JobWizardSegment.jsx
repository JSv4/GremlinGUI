import React from 'react'
import { 
    Step,
    Icon, 
    Segment,
    Button
} from 'semantic-ui-react';
import { JobStatusStep } from '../LawyerUI/JobStatusStep';
import { JobDetailsStep } from './JobDetailsStep';
import { PipelineView } from '../Pipelines/PipelineView';
import { DocumentSelectionStep } from './DocumentSelectionStep';
import { VerticallyCenteredDiv, HorizontallyCenteredDiv } from '../Shared/Wrappers';

import _ from 'lodash';

export const totalSteps = 4;
 
function NavButtons(props) {
    
    const { step } = props;

    let prevButton = <></>;
    let nextButton = <></>;

    if (step === 0) {
        
        prevButton = (
            <Button
                primary
                icon
                labelPosition='left'
                onClick={props.reverseStep}
                style={{width:'10vw'}}
            >
                Home
                <Icon name='home' />
            </Button>
        );

        nextButton = (
            <Button
                icon
                positive
                labelPosition='right'
                onClick={props.advanceStep}
                style={{width:'10vw'}}
            >
                Next
                <Icon name='right arrow' />
            </Button>
        );
    } 
    if (step === 1) {
        
        prevButton = 
        (<Button
            icon
            labelPosition='left'
            onClick={props.reverseStep}
            style={{width:'10vw'}}
        >
            Back
            <Icon name='left arrow' />
        </Button>);

        nextButton = (
            <Button
                icon
                positive
                labelPosition='right'
                onClick={props.advanceStep}
                style={{width:'10vw'}}
            >
                Next
                <Icon name='right arrow' />
            </Button>
        );
    }
    if (step === 2) {
        
        prevButton = 
        (<Button
            disabled
            icon
            labelPosition='left'
            onClick={props.reverseStep}
            style={{width:'10vw'}}
        >
            Back
            <Icon name='left arrow' />
        </Button>);

        nextButton = (
            <Button
                icon
                positive
                labelPosition='right'
                onClick={props.advanceStep}
                style={{width:'10vw'}}
            >
                Start
                <Icon name='play circle outline' />
            </Button>
        );
    }

    if (step===3) {
        prevButton = 
        (<Button
            disabled
            icon
            labelPosition='left'
            onClick={props.reverseStep}
            style={{width:'10vw'}}
        >
            Back
            <Icon name='left arrow' />
        </Button>);

        nextButton = 
        (<Button
            primary
            icon
            labelPosition='right'
            onClick={props.advanceStep}
            style={{width:'10vw'}}
        >
            Home
            <Icon name='home' />
        </Button>);
    }
        
    return (
        <Button.Group>
            {prevButton}
            <Button.Or />
            {nextButton}
        </Button.Group>
    );
}

function StepDisplay(props) {
    return (
        <Step.Group style={{width:'100%'}}>
            <Step active={props.step===0}>
                <Icon name='shuffle' />
                <Step.Content>
                    <Step.Title>Pipeline</Step.Title>
                    <Step.Description>Choose Analysis Type</Step.Description>
                </Step.Content>
            </Step>
            <Step active={props.step===1}>
                <Icon name='briefcase' />
                <Step.Content>
                    <Step.Title>Job Settings</Step.Title>
                    <Step.Description>Job Name, Notifications, etc.</Step.Description>
                </Step.Content>
            </Step>
            <Step active={props.step===2}>
                <Icon name='file text outline' />
                <Step.Content>
                    <Step.Title>Documents</Step.Title>
                    <Step.Description>Upload Your Documents</Step.Description>
                </Step.Content>
            </Step>
            <Step active={props.step===3}>
                <Icon name='play' />
                <Step.Content>
                    <Step.Title>Start</Step.Title>
                    <Step.Description>Launch Your Job</Step.Description>
                </Step.Content> 
            </Step>
        </Step.Group>
    );
}

export const JobWizardSegment = (props) => {
    
    const {pipelines, documents, jobs, results} = props;
    
    let selectedJob = _.find(jobs.items, {id: jobs.selectedJobId});

    let steps={
        0: <PipelineView 
            pipelines={pipelines}
            refreshPipelines={props.refreshPipelines}
            handleSelectPipeline={props.handleSelectPipeline}
            handleSetPipelineSearchString ={props.handleSetPipelineSearchString}
            handlePipelinePageChange = {props.handlePipelinePageChange}/>,
        1: <JobDetailsStep
            handleJobFormChange={props.handleJobFormChange}
            name={props.name}
            notification_email={props.notification_email}/>,
        2: <DocumentSelectionStep
            documents={documents}
            onDelete={props.handleDeleteDocument}
            onDownload={props.handleDownloadDocument}
            onUpload={props.handleUploadDocument}
            handleSelectDocumentPage={props.handleSelectDocumentPage}
            pages={document.pages}/>,
        3: <JobStatusStep
            handleUpdateJob = {props.handleUpdateJob}
            handleDownloadResult = {props.handleDownloadResult}
            selectedJob={selectedJob}
            pipelines={pipelines}
            results={results}/>
        };

    return (
        <VerticallyCenteredDiv>
            <HorizontallyCenteredDiv>
                <Segment style={{width: '75vw', height:'100%'}}>
                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'space-between',
                        alignItems:'center', 
                        height: '100%',
                        width: '100%'
                    }}>
                        <div style={{width:'100%', height: '10%', marginBottom: '10px'}}>
                            <StepDisplay step={props.step}/>
                        </div>
                        <div style={{height: '80%', width: '100%', flexGrow: 4, marginBottom: '10px'}}>
                            {steps[props.step] ? steps[props.step] : <></>}
                        </div>
                        <div style={{
                            display:'flex',
                            flexDirection:'row',
                            justifyContent:'flex-end',
                            alignItems:'center', 
                            width: '100%',
                            height: '10%'
                        }}>
                            <NavButtons
                                step={props.step}
                                advanceStep={props.advanceStep}
                                reverseStep={props.reverseStep}
                            />
                        </div>
                    </div>
                </Segment>
            </HorizontallyCenteredDiv>
        </VerticallyCenteredDiv>    
    );
}