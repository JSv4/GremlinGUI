import React from 'react';
import { 
    Segment,
    Message,
 } from 'semantic-ui-react';
import _ from 'lodash';
import { NodeResultStats, NodePanelHeader } from '../../../Shared/DetailsWidgets';
import { NodeInputTab, NodeOutputTab } from '../../../Shared/SidebarTabs';
import LogModal from '../../../Shared/LogModal';
import { SidebarLoadingPlaceholder } from '../../../Shared/Placeholders';

export class NodeResultPanel extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state={
            showLogModal: false
        };
    }

    setShowLogModal = (showLogModal) => {
        this.setState({
            showLogModal
        });
    }

    componentDidMount() {
         // If a node is selected and there's already a summary result, try to fetch detailed results on mount.
        if (this.props.selectedNodeResult && !this.props.selectedNodeResult.hasOwnProperty('node_output_data')) {
            try {
                this.props.handleFetchResultData(this.props.selectedNodeResult.id);
            }
            catch {}
        } 
    }

    loadAndShowLog = (jobId, stepId) => {
        this.props.handleFetchJobStepLog(jobId, stepId);
        this.setShowLogModal(true);
    }

    render() {
        const { 
            selectedNode,
            sidebarTab,
            selectedNodeResult,
            toggleDeleteConfirm,
            handleDownloadResult,
            handleScriptSelect,
            scripts, 
            pipelinesteps, 
            loading,
            jobs 
        } = this.props;

        //If loading, then nothing to display yet and just indicate loading underway
        if (loading) {
            return (
                <SidebarLoadingPlaceholder LoadingText="Loading Data..."/>
            );
        }
        //If we don't have any node details yet store is no longer trying to load... assume there is no results obj for node...
        else if (selectedNode && !selectedNodeResult) {
            return (
                <Segment>
                    <Message
                        error
                        header='This node has no results...'
                        list={[
                            'DON\'T PANIC! This node may not have started yet...',
                            'FIRST... If the job hasn\'t completed...try checking again later.',
                            'SECOND... If your job is data or memory intensive... try breaking it into smaller pieces.',
                            'If you\'re still having trouble or the job has completed without returning a node result, please reach out on our Github.',
                        ]}
                    />               
                </Segment>
            );
        }
        else {
            let output_data = {};
            try {
                output_data = selectedNodeResult.node_output_data;
            } catch {}

            let raw_input_data = {};
            try {
                raw_input_data = selectedNodeResult.start_state;
            } catch {}

            // TODO - switch backend from JSON strings to JSON objs.
            let transformed_input_data = {};
            try {
                transformed_input_data = JSON.parse(selectedNodeResult.transformed_input_data);
            } catch {}

            const log = jobs.selectedJob ? 
                        jobs.jobStepLogs[parseInt(selectedNode.id)] || "No logs..." :
                        "No job selected...";
            

            let tabs = [];
            if (selectedNode)
            {
                let script = _.find(scripts.items,{id: selectedNodeResult.script_id});
                let pipelinestep = _.find(pipelinesteps.items, {id:parseInt(selectedNode)});
                let transform_script = pipelinestep ? 
                                        pipelinestep.input_transform ?
                                        pipelinestep.input_transform :
                                        "No transformation in pipeline" :
                                        "Error loading pipeline details...!"

                let startTime = "N/A";
                let startDate = "N/A";
                if (selectedNodeResult.start_time) {
                    var dStart = new Date(selectedNodeResult.start_time);
                    startTime = dStart.toLocaleTimeString();
                    startDate = dStart.toLocaleDateString();
                }
                let endTime = "N/A"; 
                let endDate = "N/A";
                if (selectedNodeResult.stop_time) {
                    var dEnd = new Date(selectedNodeResult.stop_time);
                    endTime = dEnd.toLocaleTimeString();
                    endDate = dEnd.toLocaleDateString()
                }

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
                
                tabs = [(<>
                            <LogModal
                                handleModalToggle={() => this.setShowLogModal(!this.state.showLogModal)}
                                visible={this.state.showLogModal}
                                log={log}
                                loading={jobs.logs_loading}
                            />
                            <NodePanelHeader
                                selectedNode = {selectedNode}
                                script = {script}
                            />
                            <NodeResultStats
                                selectedNode = {selectedNode}
                                imageUrl = {imageUrl}
                                script = {script}
                                startTime = {startTime}
                                startDate = {startDate}
                                endTime = {endTime}
                                endDate = {endDate}
                                result = {selectedNodeResult}
                                toggleDeleteConfirm = {toggleDeleteConfirm}
                                handleDownloadResult = {handleDownloadResult}
                                loadAndShowLog = {this.loadAndShowLog}
                                handleScriptSelect = {handleScriptSelect}
                                style={{marginTop:'1vh'}}
                            />
                        </>),
                        (<>
                            <NodePanelHeader
                                selectedNode = {selectedNode}
                                script = {script}
                            />
                            <NodeInputTab
                                raw_input_data={raw_input_data}
                                input_data_label="Data Received from Preceding Node:" 
                                transform_script={transform_script}
                                transformed_input_data={transformed_input_data} 
                                transformed_input_data_label="Data Fed to Script (Post Transform):"
                                style={{marginBottom:'1vh'}}
                            />
                        </>),
                        (<>
                            <NodePanelHeader
                                selectedNode = {selectedNode}
                                script = {script}
                            />
                            <NodeOutputTab output_data={output_data}/>
                        </>)
                ];
            }
            
            return (
                <Segment raised style={{height:'100%', width:'100%', overflowY:'scroll'}}>
                    {tabs[sidebarTab]}
                </Segment>
            );
        }  
    }
}