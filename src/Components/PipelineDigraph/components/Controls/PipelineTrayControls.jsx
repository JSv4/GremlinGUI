import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export const PipelineTrayControls = (props) => {
    const { 
        selectedTab,
        selectTab,
        selectedNode,
        buildMode,
    } = props;

    if (selectedNode) return <PipelineNodeControls selectedTab={selectedTab} selectTab={selectTab} buildMode={buildMode}/>;

    return <PipelineControls selectedTab={selectedTab} selectTab={selectTab} buildMode={buildMode}/>

}

export const PipelineNodeControls = (props) => {
    
    const { selectedTab, selectTab, buildMode} = props;

    let buttons = [
        (<Menu.Item
            key="nodeOverview"
            name='nodeOverview'
            active={selectedTab===0}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(0);
            }}
        >
            <Icon name='dot circle outline' />
            Node
        </Menu.Item>),
        (<Menu.Item
            key="nodeSettings"
            name='nodeSettings'
            active={selectedTab===1}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(1);
            }}
        >
            <Icon name='settings' />
            Settings
        </Menu.Item>),
        (<Menu.Item
            key='inputTransform'
            name='inputTransform'
            active={selectedTab===2}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(2);
            }}
        >
            <Icon name='code' />
            Input Transform
        </Menu.Item>) 
    ];

    if (buildMode) {
        buttons.push(
            <Menu.Item
                key="testInputs"
                name='testInputs'
                active={selectedTab===3}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(3);
                }}
            >
                <Icon name='cloud upload' color='purple'/>
                Test Input
            </Menu.Item>
        );
        buttons.push(
            <Menu.Item
                key="testOutputs"
                name='testOutputs'
                active={selectedTab===4}
                onClick={(e)=> {
                    e.stopPropagation();
                    selectTab(4);
                }}
            >
                <Icon name='cloud download' color='purple' />
                Test Output
            </Menu.Item> 
        );
    }

    return (
        <Menu icon='labeled' vertical>
            {buttons}
        </Menu>);
}

export const PipelineControls = (props) => {
    
    const { 
        selectedTab,
        selectTab,
        buildMode
    } = props;

    let buttons = [
        (<Menu.Item
            key="pipelineOverview"
            name='pipelineOverview'
            active={selectedTab===0}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(0);
            }}
        >
            <Icon name='code branch' />
            Pipeline
        </Menu.Item>),
        (<Menu.Item
            key='pipelineSchema'
            name='pipelineSchema'
            active={selectedTab===1}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(1);
            }}
        >
            <Icon name='table' />
            Input Schema
        </Menu.Item>)
    ];

    if (buildMode) buttons.push(
        <Menu.Item
            key="testInputs"
            name='testInputs'
            active={selectedTab===2}
            onClick={(e)=> {
                e.stopPropagation();
                selectTab(2);
            }}
        >
            <Icon name='cloud upload' color='purple' />
            Test Inputs
        </Menu.Item>
    );

    return (
        <Menu icon='labeled' vertical>
            {buttons}
        </Menu>);
}
