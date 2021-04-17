import * as React from 'react';
import { 
    Button,
    Grid,
    Segment, 
    Divider,
    Popup,
    Dimmer,
    Loader
} from 'semantic-ui-react';
import _ from 'lodash';

import LogModal from '../../../Shared/LogModal';
import { TransformScriptBuilderModal } from '../../../Shared/TransformScriptBuilderModal';
import { JsonEditor } from '../../../Editors/JsonEditor';
import { CodeEditor } from '../../../Editors/CodeEditor';
import { NodeOutputTab, NodeInputTab } from '../../../Shared/SidebarTabs';
import { StartStopStats, NodeResultActions, SummaryNodeResultStats, NodePanelHeader } from '../../../Shared/DetailsWidgets';

export class NodeDetailPanel extends React.PureComponent {
    
    constructor(props) {
        super(props);

        this.state = {
            expanded: true,
            activeIndex: 0,
            newNodeName:"",
            showNamePopup:false,
            showLogModal:false,
            showTransformBuilder: false
        };
        this.namePopupTrigger = React.createRef()
    }
    
    handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

    setShowLogModal = (showLogModal) => {
        this.setState({
            showLogModal
        });
    }

    // If selected node changes, we're in buildMode and there's a result obj for the current node, check to see if the output_data prop is present
    // This will only get sent by the backend when a special action call is made to the results endpoint. If it's not present, we assume that
    // we need to fetch this data
    componentDidUpdate(prevProps) {
        if (prevProps.selectedNode.id !== this.props.selectedNode.id) {
            let selectedNodeResult = null;
            if (this.props.buildMode && this.props.selectedNode) {
                try {
                    selectedNodeResult = _.find(this.props.results.items, {pipeline_node: this.props.selectedNode.id})
                    if (selectedNodeResult) {
                        this.props.handleFetchResultData(selectedNodeResult.id);
                    }
                } catch {}
            }
        }
    }
   
    componentDidMount() {
        let selectedNodeResult = null;
        if (this.props.buildMode && this.props.selectedNode) {
            try {
                selectedNodeResult = _.find(this.props.results.items, {pipeline_node: this.props.selectedNode.id})
                if (selectedNodeResult) {
                    this.props.handleFetchResultData(selectedNodeResult.id);
                } 
            } catch {}
        } 
    }

    toggleShowTransformBuilderModal = () => {
        this.setState({
            showTransformBuilder: !this.state.showTransformBuilder
        });
    }

    onSaveScript = (newScript) => {
        try {
            let newPipelineStepObj = {...this.props.selectedNode};
            newPipelineStepObj.input_transform = newScript;
            this.props.handleUpdatePipelineStep(newPipelineStepObj);
        }
        catch {
            console.log("Error trying to update transform script")
        }
    }

    onSaveInputs = (settingsJsonString) => {
        try {
            let newPipelineStepObj = {...this.props.selectedNode};
            newPipelineStepObj.step_settings = settingsJsonString;
            this.props.handleUpdatePipelineStep(newPipelineStepObj);
        }
        catch {
            console.log("Error trying to update pipeline step settings.")
        }
    }

    onSaveName = (newName) => {
        try {
            let newPipelineStepObj = {id: this.props.selectedNode.id};
            newPipelineStepObj.name = newName;
            this.props.handleUpdatePipelineStep(newPipelineStepObj);
        }
        catch {
            console.log("Error trying to update pipeline step name.")
        }
    }

    loadAndShowLog = (jobId, stepId) => {
        this.props.handleFetchTestJobStepLog(jobId, stepId);
        this.setShowLogModal(true);
    }

    render() {
        
        const { 
            selectedNode,
            selectedPipelineId,
            sidebarTab,
            test_job,
            buildMode,
            scripts,
            results
        } = this.props;

        let selectedNodeResult = null;
        if (buildMode && selectedNode) {
            try {
                selectedNodeResult = _.find(results.items, {
                    pipeline_node: selectedNode.id,
                    type: "STEP"
                });
            } catch {}
        }

        let script = selectedNode && selectedNode.script && scripts.items ? 
                        _.find(scripts.items,{id: selectedNode.script}) : {};

        let transform_script = selectedNode ? 
                                selectedNode.input_transform ?
                                    selectedNode.input_transform :
                                        "No transformation in pipeline" :
                                            "Error loading pipeline details...!";

        let imageUrl = '';
        if (script && script.type){
            switch (script.type) {
                case 'RUN_ON_JOB_DOCS_PARALLEL':
                    imageUrl = './parallel_job.png';
                    break;
                case 'RUN_ON_JOB':
                    imageUrl = './serial_job.png';
                    break;
                default:
                    break;
            }
        }

        let startTime = "N/A";
        let startDate = "N/A";
        let endTime = "N/A"; 
        let endDate = "N/A";

        let output_data = { data: null };
        let input_data = { data: null };
        let transformed_input_data = { data: null };

        let buildModeStyle = { backgroundColor: '#6435c9' };

        if (selectedNodeResult) {   
            if (selectedNodeResult.start_time) {
                var dStart = new Date(selectedNodeResult.start_time);
                startTime = dStart.toLocaleTimeString();
                startDate = dStart.toLocaleDateString();
            }
            
            if (selectedNodeResult.stop_time) {
                var dEnd = new Date(selectedNodeResult.stop_time);
                endTime = dEnd.toLocaleTimeString();
                endDate = dEnd.toLocaleDateString()
            }
            
            if (selectedNodeResult.node_output_data) output_data = selectedNodeResult.node_output_data;

            if (selectedNodeResult.start_state) input_data = selectedNodeResult.start_state;

            if (selectedNodeResult.transformed_input_data) {
                try {
                    transformed_input_data = JSON.parse(selectedNodeResult.transformed_input_data);
                } catch {}
            }

        }

        let settings = {};
        try {
            settings = JSON.parse(selectedNode.step_settings);
        }
        catch {}

        //Get the latest log
        const log = test_job.test_job ? 
                    test_job.testJobStepLogs[parseInt(selectedNode.id)] || "No logs..." :
                    "No job selected...";

        const tabs = [
            (<>
                <LogModal
                    handleModalToggle={() => this.setShowLogModal(!this.state.showLogModal)}
                    visible={this.state.showLogModal}
                    log={log}
                    loading={test_job.logs_loading}
                />
                {selectedNode ? (
                    <>
                        <Segment>
                            {/* <div style={{padding: '10px'}} ref={this.namePopupTrigger}>
                                <Header as='h2' textAlign='left'>
                                    {selectedNode.name}
                                    <Header.Subheader>
                                        Click to edit name...
                                        <Button
                                            circular
                                            size='mini'
                                            icon='edit'
                                            onClick={() => this.setState({showNamePopup: !this.state.showNamePopup})}
                                        />
                                    </Header.Subheader>
                                </Header>
                                <Popup
                                        context={this.namePopupTrigger}
                                        content={
                                            <Segment style={{width:'7vw', minWidth:'200px'}}>
                                                <Label 
                                                    corner='right'
                                                    icon='close'
                                                    onClick={() => {
                                                        this.setState({showNamePopup: false});
                                                    }}
                                                />
                                                <Form
                                                    onSubmit={() => {
                                                        this.onSaveName(this.state.newNodeName);
                                                        this.setState({showNamePopup: false});
                                                    }}
                                                >
                                                    <Form.Group widths='equal'>
                                                        <Form.Input
                                                            fluid
                                                            label='Change Node Name:'
                                                            placeholder='Node name...'
                                                            name='name'
                                                            value={this.state.newNodeName}
                                                            onChange={(e, { name, value }) => {
                                                                this.setState({
                                                                    newNodeName: value
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <Button primary>
                                                            Save
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Segment>
                                        }
                                        position='top left'
                                        open={this.state.showNamePopup}
                                    />
                            </div> */}
                            <Divider horizontal>Node Details:</Divider>
                            <SummaryNodeResultStats
                                result={selectedNode}
                                imageUrl={imageUrl}
                                script={script}
                                handleScriptSelect={this.props.handleScriptSelect}
                                style={buildModeStyle}
                            />
                        </Segment>
                        { buildMode ?  
                                <Segment>
                                    <StartStopStats
                                        startTime = { startTime }
                                        startDate = { startDate }
                                        endTime = { endTime }
                                        endDate = { endDate }
                                        style = { buildModeStyle }
                                    />
                                    <Grid style = { buildModeStyle }>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <NodeResultActions
                                                    result = {selectedNodeResult}
                                                    handleDownloadResult = {this.props.handleDownloadResult}
                                                    loadAndShowLog = {this.loadAndShowLog}   
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment> 
                            : 
                            <></>
                        }
                    </>
                ) : (
                    <></>
                )}
            </>),
            (<JsonEditor
                onSave={this.onSaveInputs}
                toolTip="This json will be passed to the node's script each time it runs. Any *job* level settings with the same key will overrite these settings. This is a good way to set sane defaults for a give script given the purpose of a pipeline."
                jsonObj={settings}
            />),
            (<CodeEditor
                onSave={this.onSaveScript}
                code={transform_script}
                toolTip="This python script will take the output data JSON from the previous node / script (if any), and apply the transformation set forth herein before passing it to the node's scripts. This is useful for quick and dirty adjustments to script inputs to make two blocks compatible."
                additionalActions={ buildMode ? 
                    <Popup 
                        content='Visually edit a transform script using the currently-loaded test data.'
                        trigger={
                            <Button 
                                content="Test New Transform"
                                labelPosition='right'
                                icon='edit'
                                color='blue'
                                size='mini'
                                onClick={this.toggleShowTransformBuilderModal}
                            />
                        }
                    /> : <></>
                }
            />)
        ];
         

        if (buildMode) {
            tabs.push(
                <NodeInputTab
                    raw_input_data = {input_data}
                    transform_script = {transform_script}
                    transformed_input_data= {transformed_input_data}
                    loading_text={selectedNodeResult ? results.loading ? "Loading data..." : false : "No node results yet..."}
                />
            );
            tabs.push(
                <NodeOutputTab
                    output_data={output_data}
                    loading_text={selectedNodeResult ? results.loading ? "Loading data..." : false : "No node results yet..."}
                />
            );      
        }

        return (
            <Segment
                style={{
                    overflowY:'hidden',
                    height:'100%',
                    width:'100%',
                    margin:'0px'
                }}
            >
                { buildMode ?
                    <TransformScriptBuilderModal
                        myResult = {selectedNodeResult}
                        test_job = {test_job}
                        pipelineStep = {selectedNode}
                        toggleModalVisible = {this.toggleShowTransformBuilderModal}
                        visible = {this.state.showTransformBuilder}
                        updatePipelineStep = {this.props.handleUpdatePipelineStep}
                        handleTestTransformForResult={this.props.handleTestTransformForResult}
                    /> : <></> 
                }
                <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                    <Popup
                        content="Enable test mode so you can run the pipeline as you build it."
                        position='top right' 
                        trigger={
                            <div style={{marginBottom:'.5vh'}}>
                                <Button
                                    circular
                                    size='mini'
                                    toggle
                                    active={buildMode}
                                    onClick={() => this.props.toggleTestMode(selectedPipelineId)}
                                >
                                    TEST
                                </Button>
                            </div>
                        }
                    />
                    <NodePanelHeader
                        selectedNode = {selectedNode}
                        script = {script}
                    />
                    { buildMode && test_job.test_job && test_job.test_job.started && !test_job.test_job.finished ? 
                        <Dimmer active inverted>
                            <Loader inverted>Test Job Running...</Loader>
                        </Dimmer> : <></> }
                    {tabs[sidebarTab]}
                </div>
            </Segment>
        );
    }
}

