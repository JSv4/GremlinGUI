import * as React from 'react';
import {Label} from 'semantic-ui-react';

export const StepStatusRibbons = (props) => {
    const {step} = props;
    if (!step){
        return <Label color='grey' key='grey' size='mini'>NOT Started</Label>; 
    }
    else {
        if(step.finished) return <Label color='green' key='green' size='mini'>Finished</Label>;
        if(step.error) return <Label color='red' key='red' size='mini'>ERROR</Label>;
        if(step.started && !step.finished) return <Label color='blue' key='blue' size='mini'>Running...</Label>;
        if(step.queued & !step.started) return <Label color='green' key='green' size='mini'>Queued</Label>;
        if(!step.queued & !step.started) return <Label color='grey' key='grey' size='mini'>NOT Started</Label>; 
    }
}

export const JobStatusLabels = (props) => {
    return (
        <Label.Group size='mini'>
            {props.job.finished ? <Label color='green' key='green'>Finished</Label> : <></>}
            {props.job.error ? <Label color='red' key='red'>ERROR</Label> : <></>}  
            {props.job.started && !props.job.finished ? <Label color='blue' key='blue'>Running...</Label> : <></>}
            {props.job.queued & !props.job.started? <Label color='green' key='green'>Queued</Label> : <></>}  
            {!props.job.queued & !props.job.started? <Label color='grey' key='grey'>NOT Started</Label> : <></>}
        </Label.Group> 
    );
}

export const StepStatusLabel = (props) => {
    if (!props.step) {
        return (
            <Label.Group size='mini'>
                <Label color='grey'>NOT Started</Label>
                {props.buildMode ? <Label color='blue'>BUILD MODE</Label> : <></>}
            </Label.Group> 
        );
    }
    else {
        return (
            <Label.Group size='mini'>
                {props.step.finished ? <Label color='green' key='grey'>Finished</Label> : <></>}
                {props.step.error ? <Label color='red' key='red'>ERROR</Label> : <></>}  
                {props.step.started && !props.step.finished ? <Label color='blue' key='grey'>Running...</Label> : <></>}
                {!props.step.started ? <Label color='grey'>NOT Started</Label> : <></>}
                {props.buildMode ? <Label color='blue'>BUILD MODE</Label> : <></>}
            </Label.Group> 
        );
    }
}
