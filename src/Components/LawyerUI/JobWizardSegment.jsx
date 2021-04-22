import React from 'react'
import { 
    Step,
    Icon, 
    Segment,
    Button
} from 'semantic-ui-react';
import { InputFormStep } from './InputFormStep';
import { JobStatusStep } from '../LawyerUI/JobStatusStep';
import { JobDetailsStep } from './JobDetailsStep';
import { PipelineView } from '../Pipelines/PipelineView';
import { DocumentSelectionStep } from './DocumentSelectionStep';
import { VerticallyCenteredDiv, HorizontallyCenteredDiv } from '../Shared/Wrappers';

import _ from 'lodash';
 
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
            {props.selectedPipeline && props.selectedPipeline.input_json_schema!=={} ? <Step active={props.step===2}>
                <Icon name='briefcase' />
                <Step.Content>
                    <Step.Title>Job Inputs</Step.Title>
                    <Step.Description>Provide Any Required Information / Inputs</Step.Description>
                </Step.Content>
            </Step> : <></>}
            <Step active={props.step===3}>
                <Icon name='file text outline' />
                <Step.Content>
                    <Step.Title>Documents</Step.Title>
                    <Step.Description>Upload Your Documents</Step.Description>
                </Step.Content>
            </Step>
            <Step active={props.step===4}>
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
    
    const {pipelines, documents, jobs, results, selectedPipeline, selectedJob, job_input_json} = props;
    
    let steps={
        0: {
            component:<PipelineView 
                        pipelines={pipelines}
                        refreshPipelines={props.refreshPipelines}
                        handleSelectPipeline={props.handleSelectPipeline}
                        handleSetPipelineSearchString ={props.handleSetPipelineSearchString}
                        handlePipelinePageChange = {props.handlePipelinePageChange}/>,
            prevButton: <Button
                            primary
                            icon
                            labelPosition='left'
                            onClick={props.reverseStep}
                            style={{width:'10vw'}}
                        >
                            Home
                            <Icon name='home' />
                        </Button>,
            nextButton:  <Button
                            icon
                            disabled={pipelines.selectedPipelineId===-1 ? 'disabled' : ''}
                            positive
                            labelPosition='right'
                            onClick={props.advanceStep}
                            style={{width:'10vw'}}
                        >
                            Next
                            <Icon name='right arrow' />
                        </Button> 
            },
        1:  {
                component: <JobDetailsStep
                                handleJobFormChange={props.handleJobFormChange}
                                name={props.name}
                                notification_email={props.notification_email}/>,
                prevButton: <Button
                                icon
                                labelPosition='left'
                                onClick={props.reverseStep}
                                style={{width:'10vw'}}
                            >
                                Back
                                <Icon name='left arrow' />
                            </Button>,
                nextButton:  <Button
                                icon
                                positive
                                labelPosition='right'
                                onClick={props.advanceStep}
                                style={{width:'10vw'}}
                            >
                                Next
                                <Icon name='right arrow' />
                            </Button>
            },
        2:  {
                component: <InputFormStep
                                formData={job_input_json}
                                input_schema_json={selectedPipeline? selectedPipeline.input_json_schema : {schema:{}, uischema:{}}}
                                handleInputChange={props.handleJobInputChange}
                            />,
                prevButton: <Button
                                icon
                                labelPosition='left'
                                onClick={props.reverseStep}
                                style={{width:'10vw'}}
                            >
                                Back
                                <Icon name='left arrow' />
                            </Button>,
                nextButton:  <Button
                                icon
                                positive
                                labelPosition='right'
                                onClick={props.advanceStep}
                                style={{width:'10vw'}}
                            >
                                Next
                                <Icon name='right arrow' />
                            </Button>
            },
        3:  {
                component: <DocumentSelectionStep
                                documents={documents}
                                onDelete={props.handleDeleteDocument}
                                onDownload={props.handleDownloadDocument}
                                onUpload={props.handleUploadDocument}
                                handleSelectDocumentPage={props.handleSelectDocumentPage}
                                pages={document.pages}/>,
                prevButton: <Button
                                icon
                                labelPosition='left'
                                onClick={props.reverseStep}
                                style={{width:'10vw'}}
                            >
                                Back
                                <Icon name='left arrow' />
                            </Button>,
                nextButton:  <Button
                                icon
                                positive
                                labelPosition='right'
                                onClick={props.advanceStep}
                                style={{width:'10vw'}}
                            >
                                Next
                                <Icon name='right arrow' />
                            </Button>
            },
        4:  { 
                component: <JobStatusStep
                            handleUpdateJob = {props.handleUpdateJob}
                            handleDownloadResult = {props.handleDownloadResult}
                            selectedJob={selectedJob}
                            pipelines={pipelines}
                            results={results}/>,
                prevButton: <Button
                                disabled
                                icon
                                labelPosition='left'
                                onClick={props.reverseStep}
                                style={{width:'10vw'}}
                            >
                                Back
                                <Icon name='left arrow' />
                            </Button>,
                nextButton: <Button
                                primary
                                icon
                                labelPosition='right'
                                onClick={props.advanceStep}
                                style={{width:'10vw'}}
                            >
                                Home
                                <Icon name='home' />
                            </Button>
            }
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
                            <StepDisplay step={props.step} selectedPipeline={selectedPipeline}/>
                        </div>
                        <div style={{height: '80%', width: '100%', flexGrow: 4, marginBottom: '10px'}}>
                            {steps[props.step] ? steps[props.step].component : <></>}
                        </div>
                        <div style={{
                            display:'flex',
                            flexDirection:'row',
                            justifyContent:'flex-end',
                            alignItems:'center', 
                            width: '100%',
                            height: '10%'
                        }}>
                             <Button.Group>
                                {steps[props.step] ? steps[props.step].prevButton : <></>}
                                <Button.Or />
                                {steps[props.step] ? steps[props.step].nextButton : <></>}
                            </Button.Group>
                        </div>
                    </div>
                </Segment>
            </HorizontallyCenteredDiv>
        </VerticallyCenteredDiv>    
    );
}