import * as React from 'react';
import { 
    Confirm
 } from 'semantic-ui-react';
 import _ from 'lodash';
import { NodeResultPanel } from './NodeResultPanel';
import { JobResultPanel } from './JobResultPanel';
import { JobLaunchPanel } from './JobLaunchPanel';

export class ResultPanel extends React.PureComponent {
    
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

        const { 
            selectedNode,
            jobs,
            selectedJob,
            results,
            pipelines,
            documents,
            scripts,
            pipelinesteps,
            sidebarTab,
            jobResult,
            handleDocumentDelete,
            handleUploadDocument,
            handleUpdateJob,
            handleDocumentPageChange
        } = this.props;
        const { loading } = results;
        
        if (!selectedJob || !selectedJob.started) {
            return (
                <JobLaunchPanel
                    selectedJob={selectedJob} 
                    jobLogsLoading={jobs.logs_loading}
                    pipelines={pipelines} 
                    documents={documents}
                    sidebarTab={sidebarTab}
                    handleDocumentDelete={handleDocumentDelete}
                    handleUploadDocument={handleUploadDocument}
                    handleUpdateJob={handleUpdateJob}
                    toggleDeleteConfirm={this.toggleDeleteConfirm}
                    handleDocumentPageChange={handleDocumentPageChange}
                />
            );
        }

        if (!selectedNode) {
            return (
                <>
                    <Confirm
                        header="Delete this job and its results??"
                        content="Are you sure you want to delete this job? All data will be deleted, including documents, job settings and results."
                        open={this.state.showDeleteConfirm}
                        onCancel={() => this.toggleDeleteConfirm()}
                        onConfirm={() => this.props.handleDeleteJob(this.props.selectedJobId)}
                    /> 
                    <JobResultPanel 
                        selectedJob={selectedJob}
                        jobs={jobs}
                        documents={documents}
                        sidebarTab={sidebarTab}
                        jobResult={jobResult}
                        handleDocumentPageChange={handleDocumentPageChange}
                        handleFetchJobLog={this.props.handleFetchJobLog}
                        toggleDeleteConfirm={this.toggleDeleteConfirm} 
                        handleDownloadJob={this.props.handleDownloadJob}
                        handleFetchResultData={this.props.handleFetchResultData}
                        handleDownloadDocument={this.props.handleDownloadDocument}
                    />  
                </>
            );
        }
        
        let selectedNodeResult = null;
        try{
            selectedNodeResult = _.find(this.props.results.items, {
                pipeline_node: pipelinesteps.selectedPipelineStepId,
                type: "STEP"
            });
        } catch {}

        return (
            <>
                <Confirm
                    header="Delete this job and its results??"
                    content="Are you sure you want to delete this job? All data will be deleted, including documents, job settings and results."
                    open={this.state.showDeleteConfirm}
                    onCancel={() => this.toggleDeleteConfirm()}
                    onConfirm={() => this.props.handleDeleteJob(this.props.selectedJobId)}
                />              
                <NodeResultPanel 
                    jobs={jobs}
                    pipelinesteps={pipelinesteps}
                    scripts={scripts}
                    loading={loading}
                    selectedNode={selectedNode}
                    sidebarTab={sidebarTab}
                    selectedNodeResult={selectedNodeResult}
                    handleFetchResultData={this.props.handleFetchResultData}
                    handleScriptSelect={this.props.handleScriptSelect}
                    toggleDeleteConfirm={this.toggleDeleteConfirm}
                    handleDownloadResult={this.props.handleDownloadResult}
                    handleFetchJobStepLog={this.props.handleFetchJobStepLog}
                />
            </>
        );
    }
}
