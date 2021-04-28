import React from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { JobStatusCol } from '../../../Shared/Controls';
import { DocumentInputPane, DataInputPane } from '../../../Shared/DetailsWidgets';

export const JobLaunchPanel = (props) => {

    const { 
        selectedJob,
        jobLogsLoading,
        pipelines,
        documents,
        sidebarTab,
        handleDocumentDelete,
        handleUploadDocument,
        handleUpdateJob,
        toggleDeleteConfirm,
        handleDocumentPageChange
    } = props;

    const pipeline = pipelines.selectedPipeline;

    let tabs = [];

    let input_data = {data:"No inputs provided..."};
    try {
        input_data = selectedJob.job_input_json;
    } catch {}
    
    tabs = [
        <JobStatusCol
            job={selectedJob}
            pipeline={pipeline}
            jobLogsLoading={jobLogsLoading}
            handleUpdateJob={handleUpdateJob}
        />,
        <DocumentInputPane
            job={selectedJob}
            documents={documents}
            handleDocumentDelete={handleDocumentDelete}
            handleUploadDocument={handleUploadDocument}
            handleDocumentPageChange={handleDocumentPageChange}
        />,
        <DataInputPane
            job={selectedJob}
            jobSettings={input_data}
            handleUpdateJob={handleUpdateJob}
        />
    ];
    
    return (
        <Segment
            style={{
                overflowY:'auto',
                height:'100%'
            }}
        >
            {tabs[sidebarTab]}
            <Button
                key="delete_button"
                size='small'
                labelPosition='left'
                icon='trash'
                color='red'
                content='Delete Job'
                onClick={() => toggleDeleteConfirm()}
                style={{
                    marginTop:'10px'
                }}
            />
        </Segment>
    );
}
