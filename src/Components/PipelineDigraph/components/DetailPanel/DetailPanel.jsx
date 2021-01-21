import * as React from 'react';
import { 
    Confirm,
} from 'semantic-ui-react';

import { NodeDetailPanel } from './NodeDetailPanel';
import { PipelineDetailPanel } from './PipelineDetailPanel';

export class DetailPanel extends React.PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            showDeleteConfirm: false,
        };
    }

    toggleDeleteConfirm = () => {
        this.setState({
            showDeleteConfirm: !this.state.showDeleteConfirm
        });
    }

    render() {

        let { 
            selectedNode,
            selectedPipeline,
            testJobResult,
            pipelines,
            buildMode,
            test_job,
            scripts,
            selectedScript,
            results 
        } = this.props;

        let completion_percent = 0;

        if (selectedPipeline && results) {
            if (selectedPipeline.nodes && results.items) {
                if (selectedPipeline.nodes.length > 0) {
                    completion_percent = results.items.filter(item => item.type==="STEP" && item.finished).length / selectedPipeline.nodes.length;
                }
            }
        }

        if (!selectedNode) {
            return (
                <PipelineDetailPanel
                    key={selectedNode ? selectedNode.id : -1} 
                    pipelines={pipelines}
                    buildMode={buildMode}
                    test_job={test_job}
                    completion_percent={completion_percent}
                    selectedNode={selectedNode}
                    selectedPipeline={selectedPipeline}
                    testJobResult={testJobResult}
                    setSidebarTab={this.props.setSidebarTab}
                    sidebarTab={this.props.sidebarTab}
                    toggleTestMode={this.props.toggleTestMode}
                    toggleDeleteConfirm={this.toggleDeleteConfirm} 
                    handleUpdatePipeline={this.props.handleUpdatePipeline}
                    testJobLogsLoading = {this.props.testJobLogsLoading}
                    handleDeleteTestDocument={this.props.handleDeleteTestDocument}
                    handleUploadTestDocument={this.props.handleUploadTestDocument}
                    handleDownloadDocument={this.props.handleDownloadDocument}
                    handleUpdateTestJob = {this.props.handleUpdateTestJob}
                    handleFetchTestJobLog={this.props.handleFetchTestJobLog}
                    handleFetchResultData={this.props.handleFetchResultData}
                    handleTestDocumentPageChange ={this.props.handleTestDocumentPageChange}
                />
            );
        }

        return (
            <>
                <Confirm
                    header="Delete this pipeline?"
                    content="Are you sure you want to delete this node? All data will be deleted."
                    open={this.state.showDeleteConfirm}
                    onCancel={() => this.toggleDeleteConfirm()}
                    onConfirm={() =>this.props.handleDeleteJob(this.props.selectedJobId)}
                />
                <NodeDetailPanel 
                    key={pipelines.selectedPipelineId} 
                    pipeline={pipelines}
                    selectedPipelineId={pipelines.selectedPipelineId}
                    scripts={scripts}
                    selectedScript={selectedScript}
                    selectedNode={selectedNode}
                    selectedPipeline={selectedPipeline}
                    buildMode={buildMode}
                    test_job={test_job}
                    results={results}
                    toggleTestMode={this.props.toggleTestMode}
                    setSidebarTab={this.props.setSidebarTab}
                    sidebarTab={this.props.sidebarTab}
                    handleFetchResultData={this.props.handleFetchResultData}
                    handleUpdatePipelineStep={this.props.handleUpdatePipelineStep}
                    handleScriptSelect={this.props.handleScriptSelect} 
                    toggleDeleteConfirm={this.toggleDeleteConfirm}
                    testJobLogsLoading = {this.props.testJobLogsLoading}
                    handleFetchTestJobStepLog={this.props.handleFetchTestJobStepLog}
                    handleTestTransformForResult={this.props.handleTestTransformForResult}
                />
            </>
        );
    }
}
