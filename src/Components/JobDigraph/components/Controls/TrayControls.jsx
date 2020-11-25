import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export const TrayControls = (props) => {
    const { 
        selectedTab,
        selectTab,
        selectedJob,
        selectedNode,
        jobResult,
        handleFetchResultData
    } = props;

    if (!selectedJob || !selectedJob.started) return <StartTrayControls selectedTab={selectedTab} selectTab={selectTab}/>;

    if (!selectedNode) return <JobTrayControls selectedTab={selectedTab} selectTab={selectTab} finished={selectedJob.finished} jobResult={jobResult} handleFetchResultData={handleFetchResultData}/>

    return <NodeResultControls selectedTab={selectedTab} selectTab={selectTab}/>;


}

export const NodeResultControls = (props) => {
    
    const { selectedTab, selectTab} = props;

    return (
        <Menu icon='labeled' vertical>
            <Menu.Item
                name='node'
                active={selectedTab===0}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(0);
                }}
            >
                <Icon name='code branch' />
                Node
            </Menu.Item>
            <Menu.Item
                name='inputs'
                active={selectedTab===1}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(1);
                }}
            >
                <Icon name='cloud upload' />
                Input
            </Menu.Item>
            <Menu.Item
                name='outputs'
                active={selectedTab===2}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(2);
                }}
            >
                <Icon name='cloud download' />
                Output
            </Menu.Item> 
        </Menu>);
}

export const StartTrayControls = (props) => {

    const { selectedTab, selectTab} = props;

    return (
        <Menu icon='labeled' vertical>
            <Menu.Item
                name='launch'
                active={selectedTab===0}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(0);
                }}
            >
                <Icon name='circle play' icon='green' />
                Run
            </Menu.Item>
            <Menu.Item
                name='documents'
                active={selectedTab===1}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(1);
                }}
            >
                <Icon name='file text outline'/>
                Documents
            </Menu.Item>
            <Menu.Item
                name='data'
                active={selectedTab===2}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(2);
                }}
            >
                <Icon name='cloud upload' />
                Input Data
            </Menu.Item> 
        </Menu>);
}

export const JobTrayControls = (props) => {
    
    const { 
        selectedTab,
        selectTab,
        finished,
        jobResult,
        handleFetchResultData
    } = props;

    let buttons = [
        (<Menu.Item
            name='job'
            active={selectedTab===0}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(0);
            }}
        >
            <Icon name='briefcase' />
            Job
        </Menu.Item>),
        (<Menu.Item
            name='documents'
            active={selectedTab===1}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(1);
            }}
        >
            <Icon name='file text outline'/>
            Documents
        </Menu.Item>),
        (<Menu.Item
            name='data'
            active={selectedTab===2}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(2);
            }}
        >
            <Icon name='cloud upload' />
            Input Data
        </Menu.Item>) ];

    if (finished) buttons.push((<Menu.Item
        name='data'
        active={selectedTab===2}
        onClick={(e)=> {
            if (jobResult && !jobResult.hasOwnProperty('output_data')) {
                handleFetchResultData(jobResult.id);
            }
            e.stopPropagation();
            selectTab(3);
        }}
    >
        <Icon name='cloud download' />
        Output Data
    </Menu.Item>));

    return (
        <Menu icon='labeled' vertical>
            {buttons}
        </Menu>);
}
