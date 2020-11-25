import * as React from 'react';
import { connect } from "react-redux";
import _ from 'lodash';
import { Breadcrumb, 
    Pagination,
    Segment,
    Table,  
} from 'semantic-ui-react';

import {
    fetchDocuments,
    clearResults,
    downloadSelectedResult,
    fetchPipelineScripts,
    fetchSummaryResultsForJob,
  } from '../../Redux/actions';

import {
    loadFullPipeline,
    selectPipeline,
} from '../../Redux/pipeline_actions';

import {
    selectJob,
    fetchJobs,
    unselectJob,
    clearJobLogs,
    requestJobStepLogs,
    refreshSelectedJob,
} from '../../Redux/job_actions';

import {
    changeTab
} from '../../Redux/app_actions';

import { HeaderContainer } from '../Layouts/Layouts';
import JobRow from './components/Controls/JobRow';
import { JobTable } from './components/Controls/JobTable';
import { ResultPanel } from './components/SidebarPanels/ResultPanel';
import ResultNode from './components/Nodes/ResultNode';
import { VerticallyCenteredDiv } from '../Shared/Wrappers';
import { CreateAndSearchBar, JobDigraphButtonPanel } from '../Shared/Controls';
import { Digraph } from '../Digraph/Digraph';
import { TrayControls } from './components/Controls/TrayControls';
import { PrimaryJobControls } from './components/Controls/PrimaryJobControls';
import ConfirmModal from '../Shared/ConfirmModal';
import { JobHeaderWidget } from './components/Header/JobHeaderWidget';


class JobDigraphTab extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showLog:false,
            timer: null,
            showSidebar:true,
            showDeleteConfirm:false,
            sidebarTab:0
        };
    }

    componentDidMount() {

        // Set the digraph to readonly
        this.props.digraphEngine.setLocked(true);

        // Refresh the pipelines
        this.props.fetchPipelines();

        // Refresh script summaries
        this.props.handleFetchScripts();

        // Setup the timer
        let timer = setInterval(this.tick, 5000);
        this.setState({timer});

        //Refetch jobs
        this.handleFetchJobs();

        // If we already have a job selected, make sure pipeline digraph is loaded
        if (this.props.jobs.selectedJobId) {
            console.log("TODO - Refresh job digraph"); 
        }

    }

    toggleDeleteConfirm = () => {
        this.setState({
            showDeleteConfirm: !this.state.showDeleteConfirm
        });
    }

    toggleSidebar = () => {
        this.setState({
            showSidebar: !this.state.showSidebar
        });
    }

    closeSidebar = () => {
        if (this.state.showSidebar) this.setState({showSidebar: false});
    }

    openSidebar = () => {
        if (!this.state.showSidebar) this.setState({showSidebar: true});
    }

    setSidebarTab = (tabNum) => {
        if (this.state.sidebarTab === tabNum) {
            this.toggleSidebar();
        } else {
            this.setState({
                sidebarTab: tabNum
            }, this.openSidebar());
        }
    }

    onConfirmDelete = (id) => {
        this.props.handleDeleteJob(id);
        this.toggleDeleteConfirm();
    }

    componentWillUnmount() {

        // Clean up the timer. 
        clearInterval(this.state.timer);

        // Set the digraph to back to editable (this is the engine itself, not the view lawyer)
        // don't want the read only setting to persist 
        this.props.digraphEngine.setLocked(false);
    }

    tick = () => {
        let myJob = _.find(this.props.jobs.items, {id: this.props.jobs.selectedJobId});
        console.log("Job Result Digraph Tick");
        if(myJob)
        {
            // If job is running, get the results on each tick
            if (myJob.queued || (myJob.started && !myJob.finished && !myJob.error)) {
                console.log("Job selected started and has not finished or errored out");
                this.refreshResultDigraphData();
            }
            //If job hasn't started, get documents on each tick.
            if (!myJob.started) {
                this.props.dispatch(fetchDocuments());
            }
        }
    }

    //Todo... clear and then loading is causing flickering... update objs
    refreshResultDigraphData = () => {
        this.props.dispatch(fetchSummaryResultsForJob(this.props.jobs.selectedJobId));
        this.props.dispatch(refreshSelectedJob());
    }

    handleSelectJob = (job) => {
        console.log("Job selected", job);
        this.props.dispatch(selectJob(job.id)).then(() => {
          Promise.all([
            this.props.dispatch(clearJobLogs()),
            this.props.dispatch(clearResults()),
            this.props.dispatch(selectPipeline(job.pipeline.id)),
          ])
          .then(() => {
              Promise.all([
                this.props.dispatch(fetchPipelineScripts()), //Shouldn't this be summary scripts? If it already is, rename
                this.props.dispatch(fetchSummaryResultsForJob(job.id)),
                this.props.dispatch(loadFullPipeline(job.pipeline.id))
              ]).then(()=>{
                this.props.digraphEngine.renderPipeline();
              });
          });
        });
      }

    handleFetchJobs = () => {
        this.props.dispatch(fetchJobs());
    }

    handleUnselectJob = () => {
        this.props.dispatch(unselectJob());
        this.props.dispatch(fetchJobs());
    }

    handleDownloadResult = (resultId) => {
        this.props.dispatch(downloadSelectedResult(resultId));
    }

    loadAndShowNodeLog = (jobId, stepId) => {
        this.props.dispatch(requestJobStepLogs(jobId, stepId)).then(()=>{
            this.toggleLogModal();
        });
    }

    ZoomCanvas = (scaleLevel) => {
        
        let zoomedDigraph = {...this.state.digraph};
        zoomedDigraph.scale = scaleLevel;

        this.setState(zoomedDigraph);
    }

    handleTabChange = (tabIndex) => {
        this.props.dispatch(changeTab(tabIndex));
    }

    handleSelectPipeline = (pipelineId) => {
        console.log("HandleSelectPipelineRow");
        console.log("Pipeline selected");
        this.props.dispatch(selectPipeline(pipelineId)).then(() => {
          this.props.dispatch(loadFullPipeline(pipelineId)).then(() => {
            this.handleTabChange(2);
          });
        });
      }

    render() {

        let crumbs = [
            <Breadcrumb.Section
                key={0}
                link
                onClick={() => this.handleUnselectJob()}
            >
                Jobs
            </Breadcrumb.Section>,
        ];

      const jobs = this.props.jobs.items ? this.props.jobs.items : [];
      const pipelinesteps = this.props.pipelinesteps.items ? this.props.pipelinesteps.items : [];
      let selectedJob = _.find(jobs, {id: this.props.jobs.selectedJobId});
      let selectedNode = _.find(pipelinesteps, {id: this.props.pipelinesteps.selectedPipelineStepId});
      let jobResult = null;
      try {
          jobResult = _.find(this.props.results.items, {type: 'JOB'});
      } catch {}

      let rows = [];
      if (jobs.length > 0) {
          for (let count = 0; count < jobs.length; count++) {
              rows.push(<JobRow 
                  key={jobs[count].id}
                  job={jobs[count]}
                  selected={jobs[count].id===this.props.jobs.selectedJobId}
                  pipeline={jobs[count].pipeline}
                  handleDeleteJob={this.props.handleDeleteJob}
                  handleDownloadJob={this.props.handleDownloadJob}
                  handleSelectJobRow={() => this.handleSelectJob(jobs[count])}
                  handleUpdateJob={this.props.handleUpdateJob}
                  handleTabChange={this.handleTabChange}
                  handleSelectPipeline={this.handleSelectPipeline}
                  handlePipelineModalToggle={this.props.handlePipelineModalToggle}
                  />);
          }
      }
      else {
          rows.push(<Table.Row  key={0}>
              <Table.Cell textAlign='center' colSpan='8'>No jobs match your selection</Table.Cell>
          </Table.Row>);
      }
      let table = <JobTable jobs={this.props.jobs} handleSelectJobPage={this.props.handleSelectJobPage}>
          {rows}
      </JobTable>;

        if (this.props.jobs.selectedJob) {
            crumbs.push(<Breadcrumb.Divider key={1}/>);
            crumbs.push(
                <Breadcrumb.Section active key={2}>
                    {this.props.jobs.selectedJob.name}
                </Breadcrumb.Section>
            );
        }

        let breadcrumbs = 
            <Segment raised style={{width:'100%'}}>
                <Breadcrumb>
                    {crumbs}
                </Breadcrumb>
            </Segment>;

        return (
            <VerticallyCenteredDiv>
                <ConfirmModal
                    visible={this.state.showDeleteConfirm} 
                    message="You have chosen to delete this job. ARE YOU SURE? This cannot be undone. You will lose uploaded documents and any processed results."
                    yesAction={() => this.onConfirmDelete(this.props.jobs.selectedJobId)}
                    noAction={this.toggleDeleteConfirm}
                    toggleModal={this.toggleDeleteConfirm}
                />
                { this.props.jobs.selectedJobId === -1 ? <div>
                    <CreateAndSearchBar
                        onChange={this.props.handleSetJobSearchString}
                        onCreate={this.props.handleNewJobModalToggle}
                        onSubmit={this.props.fetchJobs}
                        placeholder='Search Jobs by Name...'
                        value={this.props.jobs.searchString} 
                    />
                </div> : <></> }
                <div>
                    { this.props.jobs.selectedJobId === -1 ? 
                        <HeaderContainer 
                            header={breadcrumbs}
                            loading={this.props.jobs.loading}
                            loadingText="Fetching Job Details..."
                            body={table}
                        /> : 
                        <Digraph
                            key={this.props.jobs.selectedJob ? this.props.jobs.selectedJob.id : -1}
                            digraphEngine={this.props.digraphEngine}                                
                            toggleSidebar={this.toggleSidebar}
                            showSidebar={this.state.showSidebar}
                            exitDigraph={this.handleUnselectJob}
                            showSidebarToggle={false}
                            detailPanel={
                                <ResultPanel
                                    results={this.props.results}
                                    jobs={this.props.jobs}
                                    pipelinesteps={this.props.pipelinesteps}
                                    scripts={this.props.scripts}
                                    documents={this.props.documents}
                                    pipelines={this.props.pipelines}
                                    selectedJob={selectedJob}
                                    selectedNode={selectedNode}
                                    jobResult={jobResult}
                                    setSidebarTab={this.setSidebarTab}
                                    sidebarTab={this.state.sidebarTab}
                                    handleFetchResultData={this.props.handleFetchResultData}
                                    handleFetchJobLog={this.props.handleFetchJobLog}
                                    handleFetchJobStepLog={this.props.handleFetchJobStepLog}
                                    handleDownloadResult={this.props.handleDownloadResult}
                                    handleDownloadJob={this.props.handleDownloadJob}
                                    handleDeleteJob={this.props.handleDeleteJob}
                                    handleDownloadDocument={this.props.handleDownloadDocument}
                                    handleScriptSelect={this.props.handleScriptSelect}
                                    handleDocumentDelete={this.props.handleDocumentDelete}
                                    handleUploadDocument={this.props.handleUploadDocument}
                                    handleUpdateJob={this.props.handleUpdateJob}
                                    handleDocumentPageChange={this.props.handleDocumentPageChange}
                                />
                            }
                            controls={
                                <JobDigraphButtonPanel digraphEngine={this.props.digraphEngine}/>
                            }
                            trayControls={
                                <TrayControls
                                    selectedTab={this.state.sidebarTab}
                                    selectTab={this.setSidebarTab}
                                    selectedJob={selectedJob}
                                    selectedNode={selectedNode}
                                    jobResult={jobResult}
                                    handleFetchResultData={this.props.handleFetchResultData}
                                />
                            }
                            playControls={
                                <PrimaryJobControls
                                    job={selectedJob}
                                    startJob={this.props.handleUpdateJob}
                                    deleteJob={this.toggleDeleteConfirm}
                                    downloadJob={this.props.handleDownloadJob}
                                />
                            }
                            // headerWidget={
                            //     <JobHeaderWidget selectedJob={selectedJob}/>
                            // }
                            nodeClass={ResultNode}
                        />
                    }
                </div>
                {
                    this.props.jobs.selectedJobId === -1 ? 
                    <div style={{
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:'2vh'
                    }}>
                
                        <div>
                            <Pagination
                                activePage={this.props.jobs.selectedPage}
                                onPageChange={(e, { activePage }) => this.props.handleSelectJobPage(activePage)} 
                                totalPages={this.props.jobs.total_pages}
                            />
                        </div>  
                    </div> : <></> 
                }
            </VerticallyCenteredDiv>);
    }
}

function mapStateToProps(state) {
    
    const {
        results, 
        documents,
        jobs,
        scripts,
        pipelines,
        pipelinesteps,
        application
    } = state;
  
    return {
        results,
        documents,
        jobs,
        scripts,
        pipelines,
        pipelinesteps,
        application
    };
  }

export default connect(mapStateToProps)(JobDigraphTab);