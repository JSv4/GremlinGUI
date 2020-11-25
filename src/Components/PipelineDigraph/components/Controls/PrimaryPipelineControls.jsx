import React from 'react'
import { Menu, Icon, Popup } from 'semantic-ui-react'
import SelectWindow from './SelectWindow';

export const PrimaryPipelineControls = (props) => {
    
    const { 
        deletePipeline,
        downloadPipeline,
        downloadTestResult,
        handleUpdateJob,
        onAddNode,
        buildMode,
        scripts,
        test_job,
        windowHeight } = props;

    const contextRef = React.useRef()
    const [addModalVisible, setAddModalVisible] = React.useState(false)

    let buttons = [
        (<Menu.Item
            disabled={buildMode}
            key='deleteJob'
            name='deleteJob'
            onClick={(e)=> {
                e.stopPropagation();
                deletePipeline();
            }}
        >
            <Icon name='trash' color='red'/>
            Delete
        </Menu.Item>),
        (<Menu.Item
            disabled={buildMode}
            key="addNode"
            name='addNode'
            onClick={(e)=> {
                e.stopPropagation();
                setAddModalVisible(!addModalVisible);
            }}
        >
            <Icon name='add' color='green'/>
            <strong ref={contextRef}>Add Node</strong>
        </Menu.Item>),
        (<Menu.Item
            disabled={buildMode}
            key="downloadJob"
            name='downloadJob'
            onClick={(e)=> {
                e.stopPropagation();
                downloadPipeline();
            }}
        >
            <Icon name='save' color='blue'/>
            Export
        </Menu.Item>)
    ];

    if (buildMode && test_job && !test_job.started) {
        buttons.push(
            <Menu.Item
                key="startTest"
                name='startTest'
                onClick={(e)=> {
                    e.stopPropagation();
                    let updatedObject = {id: test_job.id, queued: true};
                    handleUpdateJob(updatedObject);
                }}
            >
                <Icon name='play' color='purple'/>
                Start Test
            </Menu.Item>
        );
    }
    if (buildMode && test_job && test_job.file) {
        buttons.push(
            <Menu.Item
                key="downloadTestResults"
                name='downloadTestResults'
                onClick={(e)=> {
                    e.stopPropagation();
                    downloadTestResult(test_job.id);
                }}
            >
                <Icon name='download' color='purple'/>
                Test Results
            </Menu.Item>
        );
    }

    return (
        <Menu icon='labeled'>
            <Popup
                context={contextRef}
                content={<SelectWindow setAddModalVisible={setAddModalVisible} scripts={scripts.items} onAddNode={onAddNode}/>}
                position='top center'
                open={addModalVisible}
                offset={[0, Math.ceil(windowHeight*.025)]}
            />
            {buttons}
        </Menu>);
}
