import React from 'react';
import { Segment } from 'semantic-ui-react';
import LogModal from '../../../Shared/LogModal';
import { JobResultStats, JobPanelHeader } from '../../../Shared/DetailsWidgets';
import { NodeOutputTab } from '../../../Shared/SidebarTabs';
import { 
    JobDocumentReadOnlyTab,
    JobInputReadOnlyTab
} from '../../../Shared/SidebarTabs';
import { SidebarLoadingPlaceholder } from '../../../Shared/Placeholders';

// Made this a class component to take advantage of lifecycle methods, though now I don't need them (and realize I could have used hooks, ugh).
// TODO - rever
export class JobResultPanel extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            showLogModal: false
        };
    }

    setShowLogModal = (showLogModal) => {
        this.setState({
            showLogModal
        });
    }

    loadAndShowLog = () => {
        this.props.handleFetchJobLog();
        this.setShowLogModal(true);
    }

    // If the job is finished and the results object doesn't already include the output data, fetch it.
    componentDidMount() {
        if (this.props.jobResult && this.props.selectedJob.finished && !this.props.jobResult.hasOwnProperty('output_data')) {
            this.props.handleFetchResultData(this.props.jobResult.id);
        }
    }

    render() {

        const { 
            handleDocumentPageChange,
            selectedJob,
            sidebarTab,
            documents,
            handleDownloadDocument,
            jobs,
            jobResult } = this.props;
    
        let tabs = [];
        if (!selectedJob) {
            return (
                <SidebarLoadingPlaceholder LoadingText="Loading Data..."/>
            );
        }
        else
        {
    
            let input_data = {data:"No inputs provided..."};
            try {
                input_data = JSON.parse(selectedJob.job_inputs);
            } catch {}
    
            let output_data = {data:'No output data...'};
            try {
                output_data = JSON.parse(jobResult.output_data);
            } catch {}
    
            const log = selectedJob ? jobs.selectedJobLog || "No logs." : "No job selected...";
    
            let startTime = "N/A";
            let startDate = "N/A";
            if (selectedJob.start_time) {
                var dStart = new Date(selectedJob.start_time);
                startTime = dStart.toLocaleTimeString();
                startDate = dStart.toLocaleDateString();
            }
            let endTime = "N/A"; 
            let endDate = "N/A";
            if (selectedJob.stop_time) {
                var dEnd = new Date(selectedJob.stop_time);
                endTime = dEnd.toLocaleTimeString();
                endDate = dEnd.toLocaleDateString()
            }
            
            tabs = [(
                        <>
                            <LogModal
                                handleModalToggle={() => this.setShowLogModal(!this.state.showLogModal)}
                                visible={this.state.showLogModal}
                                log={log}
                                loading={this.props.jobs.logs_loading}
                            />
                            <JobPanelHeader
                                selectedJob = {selectedJob}
                            />
                            <JobResultStats
                                notification_email={selectedJob.notification_email}
                                selectedJob = {selectedJob}
                                startTime = {startTime}
                                startDate = {startDate}
                                endTime = {endTime}
                                endDate = {endDate}
                                loadAndShowLog = {this.loadAndShowLog}
                                toggleDeleteConfirm = {this.props.toggleDeleteConfirm}
                                handleDownloadJob = {this.props.handleDownloadJob}
                                style={{marginTop:'1vh'}}
                            />
                        </>
                    ),
                    (
                        <>
                            <JobPanelHeader
                                selectedJob = {selectedJob}
                            />
                            <JobDocumentReadOnlyTab
                                documents={documents.items}
                                selectedPage={documents.selectedPage}
                                pageCount={documents.pages}
                                handleDownloadDocument={handleDownloadDocument}
                                handleChangePage={handleDocumentPageChange}
                            />
                        </>
                    ),
                    ( 
                        <>
                            <JobPanelHeader
                                selectedJob = {selectedJob}
                            />
                            <JobInputReadOnlyTab input_data={input_data}/>
                        </>
                    ),
            ];
    
            if (selectedJob.finished) tabs.push((
            <>
                 <JobPanelHeader
                    selectedJob = {selectedJob}
                />
                <NodeOutputTab output_data={output_data}/>
            </>));
    
        }
        
        return (
            <Segment raised style={{height:'100%', width:'100%'}}>
                {tabs[sidebarTab]}
            </Segment>
        );
    }

}
