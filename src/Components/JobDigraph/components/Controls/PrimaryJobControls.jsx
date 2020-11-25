import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export const PrimaryJobControls = (props) => {
    
    const { job, startJob, deleteJob, downloadJob} = props;

    let buttons = [];

    if (!job.started) buttons.push(
        <Menu.Item
            name='startJob'
            onClick={(e)=> {
                e.stopPropagation();
                let startedJob = { id: job.id, queued: true};
                startJob(startedJob);
            }}
        >
            <Icon name='play' color='green'/>
            Start
        </Menu.Item>);

    buttons.push(
        <Menu.Item
            name='deleteJob'
            onClick={(e)=> {
                e.stopPropagation();
                deleteJob(job.id);
            }}
        >
            <Icon name='trash' color='red'/>
            Delete
        </Menu.Item>);

    if (job.file) buttons.push(
        <Menu.Item
            name='downloadJob'
            onClick={(e)=> {
                e.stopPropagation();
                downloadJob(job.id);
            }}
        >
            <Icon name='download'/>
            Download
        </Menu.Item> 
    );

    return (
        <Menu icon='labeled'>
            {buttons}
        </Menu>);
}
