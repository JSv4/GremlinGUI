import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Dropdown,
    Grid,
    Header,
    Icon,
    Image
} from 'semantic-ui-react';

import { ResultsModal } from '../Components/LawyerUI/ResultsModal';
import { ResultsSegment } from '../Components/LawyerUI/ResultsSegment';
import { LandingSegment } from '../Components/LawyerUI/LandingSegment';
import { JobWizardSegment } from '../Components/LawyerUI/JobWizardSegment';

import {
  fetchJobs,
  createJob,
  deleteJob,
  updateJob,
  selectJob,
  unselectJob,
  selectJobPage,
  refreshSelectedJob,
  setJobSearchString,
  downloadJobResultsById
} from '../Redux/job_actions';

import {
  tryLogout,
} from '../Redux/auth_actions';

import {
  clearDocuments,
  clearResults,
  downloadSelectedResult,
  fetchSummaryResultsForJob,
  uploadDocument,
  selectDocumentPage,
  fetchDocuments,
  deleteDocument,
  downloadSelectedDocument,
} from '../Redux/actions';

import { 
  setPipelineSearchString,
  selectPipelinePage,
  fetchPipelines,
  clearPipelines,
  selectPipeline,
  unselectPipeline, 
} from '../Redux/pipeline_actions';

import _ from 'lodash';

class LawyerHome extends Component {

  constructor(props){
    super(props);
    this.state={
      step:0,
      view:'LANDING',
      name:'',
      notification_email:'',
      timer:null,
      showResultModal:false
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchPipelines());
    let timer = setInterval(this.tick, 2000);
    this.setState({timer});
  }

  componentWillUnmount() {
      clearInterval(this.state.timer);
  }

  tick = () => {

    console.log("Tick");

    //On the document step, refresh docs to show updates to extract.
    if(this.state.step === 2) {
      this.handleRefreshDocuments();
    } 

    //On the job step (final step), refresh results and job stat
    if (this.state.step === 3 && this.props.jobs.selectedJobId!==-1) {
      this.handleRefreshSelectedJob();
      this.handleFetchSummaryResults();
    }
  }

  toggleResultModal = () => {
    this.setState({
      showResultModal: !this.state.showResultModal
    });
  }

  handleRefreshSelectedJob = () => {
    this.props.dispatch(refreshSelectedJob());
  }

  handleJobFormChange = (obj) => {
    this.setState({
      ...obj
    });
  }

  setHomeView = () => {
    Promise.all([
      this.props.dispatch(setJobSearchString("")),
      this.props.dispatch(clearResults()),
      this.props.dispatch(clearDocuments()),
      this.props.dispatch(unselectJob())
    ]).then(() => {
      this.props.dispatch(fetchJobs()).then(() => {
        this.setState({view:'LANDING'});
      });
    });
  }

  setWizardView = () => {
    this.setState({view:'WIZARD'});
  }

  setResultView = () => {
    this.props.dispatch(fetchJobs()).then(() => {
      this.setState({view:'RESULTS'});
    });
  }

  setStep = (step) => {
    this.setState({step});
  }

  advanceStep = () => {
    if (this.state.step===0){
      this.setStep(this.state.step + 1);
    }
    else if (this.state.step===1) {
      this.handleCreateJob({
        name: this.state.name,
        notification_email: this.state.notification_email,
        pipeline: this.props.pipelines.selectedPipelineId
      });
    }
    else if (this.state.step===2) {
      this.handleStartSelectedJob();
      this.setStep(this.state.step + 1);
    }
    else if (this.state.step===3) {
      this.handleStartWizardOver()
    }
  }

  reverseStep = () => {
    if (this.state.step===0){
      this.setHomeView();
    }
    else {
      this.setStep(this.state.step - 1);
    }
  }

  //Create a new job with fields in the jobObj. Then advance the wizard step to doc section.
  handleCreateJob = (jobObj) => {
    this.props.dispatch(createJob(jobObj)).then((response) => {
      this.props.dispatch(selectJob(response.id)).then(() => {
        this.setStep(2);
      });
    });
  }

  handleDownloadResult = (resultId) => {
    this.props.dispatch(downloadSelectedResult(resultId));
  }

  handleFetchSummaryResults = () => {
    this.props.dispatch(fetchSummaryResultsForJob(this.props.jobs.selectedJobId));
  }

  handleRefreshDocuments = () => {
    this.props.dispatch(fetchDocuments());
  }

  handleUploadDocument = (file) => {
    this.props.dispatch(uploadDocument(file)).then(() => {
      this.props.dispatch(fetchDocuments());
    });
  }

  handleDeleteDocument = (docId) => {
    this.props.dispatch(deleteDocument(docId));
  }

  handleDownloadDocument = (docId) => {
    this.props.dispatch(downloadSelectedDocument(docId));
  }

  handleSelectDocumentPage = (pageNo) => {
    this.props.dispatch(selectDocumentPage(pageNo)).then(() => {
      this.props.dispatch(fetchDocuments());
    });
  }

  // Set the pipeline name filter
  handleSetPipelineSearchString = (pipelineSearchString) => {
    this.props.dispatch(setPipelineSearchString(pipelineSearchString));
  }
  
  handleSelectPipeline = (pipelineId) => {
    this.props.dispatch(selectPipeline(pipelineId));
  }

  handleSelectJob = (jobId) => {
    this.props.dispatch(selectJob(jobId)).then(() => {
      console.log("Toggle modal!");
      this.toggleResultModal();
    });
  }

  // Change the page # in the redux store and then refetch pipelines (pagination is injected to url
  // request automatically)
  handlePipelinePageChange = (pageNo) => {
    this.props.dispatch(selectPipelinePage(pageNo)).then(() => {
      this.props.dispatch(fetchPipelines());
    });
  }

  refreshPipelines = () => {
    this.props.dispatch(fetchPipelines()); 
  }

  handleUpdateJob = (updatedJobObj) => {
    this.props.dispatch(updateJob(updatedJobObj));
  }

  handleDeleteJob = (jobId) => {
    this.props.dispatch(deleteJob(jobId)).then(() => {
      this.props.dispatch(clearResults());
      this.props.dispatch(clearDocuments());
      this.props.dispatch(unselectJob());
    }).then(() => {
      this.props.dispatch(fetchJobs());
    });
  }

  // Fetch jobs matching the selected page and the given filter (if any)
  handleFetchJobs = () => {
    this.props.dispatch(fetchJobs());
  }

  handleLandingJobSearch = () => {
    this.props.dispatch(fetchJobs()).then(() => {
      this.setResultView();
    });
  }
  
  // Set the job search filter which is applied automatically when fetchFilteredJobs is called
  handleSetJobsSearchString = (searchString) => {
    this.props.dispatch(setJobSearchString(searchString));
  }

  // Set the selected job page. Semantic UI pagination keeps track of what options are valid so
  // so no validation on this. 
  handleSelectJobPage = (selectedPage) => {
    this.props.dispatch(selectJobPage(selectedPage)).then(() => {
      this.props.dispatch(fetchJobs());
    });
  }

  handleStartSelectedJob = () => {
    this.handleUpdateJob({id: this.props.jobs.selectedJobId, queued: true});
  }

  handleDownloadJob = (jobId) => {
    this.props.dispatch(downloadJobResultsById(jobId));
  }

  handleStartWizardOver = () => {
    // Log out the current user (also clears selected job + associated docs and results)
    Promise.all([
      this.props.dispatch(clearDocuments()),
      this.props.dispatch(clearResults()),
      this.props.dispatch(unselectJob()),
      this.props.dispatch(unselectPipeline()),
    ]).then(() => {
      this.setHomeView();
      this.setStep(0);
    });
  }

  // Log out the current user (also clears selected job + associated docs and results)
  handleLogout = () => {
    Promise.all([
      this.props.dispatch(clearDocuments()),
      this.props.dispatch(clearResults()),
      this.props.dispatch(unselectJob()),
      this.props.dispatch(clearPipelines()),
      this.props.dispatch(unselectPipeline()),
    ]).then(() => {
      this.props.dispatch(tryLogout());
    });
  }

  render() {

    const { pipelines, documents, jobs, results, auth } = this.props;

    let selectedJob = null;
    try {
        selectedJob = _.find(jobs.items, {id: jobs.selectedJobId})
    } catch {}

    let view = <></>;
    if(this.state.view==='WIZARD') {
      view = <JobWizardSegment
                pipelines={pipelines}
                jobs={jobs}
                documents={documents}
                results={results}
                refreshPipelines={this.refreshPipelines}
                handleUpdateJob={this.handleUpdateJob}
                handleSetPipelineSearchString ={this.handleSetPipelineSearchString}
                handleSelectPipeline={this.handleSelectPipeline}
                handlePipelinePageChange ={this.handlePipelinePageChange}
                handleSelectDocumentPage={this.handleSelectDocumentPage}
                handleDeleteDocument={this.handleDeleteDocument}
                handleUploadDocument={this.handleUploadDocument}
                handleDownloadDocument={this.handleDownloadDocument}
                handleDownloadResult={this.handleDownloadResult}
                step={this.state.step}
                advanceStep={this.advanceStep}
                reverseStep={this.reverseStep}
                handleJobFormChange={this.handleJobFormChange}
                name={this.state.name}
                notification_email={this.state.notification_email}
              />;
    }
    if(this.state.view==='LANDING') {
      view = <LandingSegment
                jobs={jobs}
                setWizardView={this.setWizardView}
                setResultView={this.setResultView}
                handleSetJobsSearchString={this.handleSetJobsSearchString}
                handleLandingJobSearch={this.handleLandingJobSearch}
            />;
    }
    if(this.state.view==='RESULTS'){
      view = <ResultsSegment
                jobs={jobs}
                handleFetchJobs={this.handleFetchJobs}
                handleSetJobsSearchString={this.handleSetJobsSearchString}
                handleSelectJobPage={this.handleSelectJobPage}
                handleDownloadJob={this.handleDownloadJob}
                handleDeleteJob={this.handleDeleteJob}
                handleUpdateJob={this.handleUpdateJob}
                handleSelectJob={this.handleSelectJob}
                setHomeView={this.setHomeView}
            />;
    }

    return (
        <div style={{height:'100%', width:'100%'}}>
          <ResultsModal 
            jobs={jobs}
            selectedJob={selectedJob}
            visible={this.state.showResultModal}
            toggleModal={this.toggleResultModal}
            handleDownloadJob={this.handleDownloadJob}
            handleUpdateJob={this.handleUpdateJob}
          />
          <Grid>
            <Grid.Row style={{height:"10vh"}}>
                <Grid.Column verticalAlign='middle' textAlign='right'>
                  <div style={
                    {
                      display:'flex',
                      flexDirection:'row',
                      justifyContent:'flex-end',
                      alignItems:'stretch', 
                      height: '100%',
                      width: '100%'
                    }
                  }>
                    <div style={{marginRight:'1vw'}}>
                      <Header as='h3'>
                        <Icon name='user circle outline' />
                        <Header.Content style={{padding:'0px', paddingLeft:'5px'}}>
                          <Dropdown
                              item
                              simple
                              icon={<Icon style={{marginLeft:'5px'}} name='dropdown'/>}
                              text={`User: ${auth.username}`}
                              style={{margin:'0px', padding:'0px'}} 
                              header='Logout'>
                              <Dropdown.Menu>
                                <Dropdown.Item 
                                  text='Logout'
                                  onClick={this.handleLogout}
                                  icon={<Icon name='log out'/>}/>
                              </Dropdown.Menu>
                          </Dropdown>
                        </Header.Content>
                      </Header>
                    </div>
                  </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered stretched style={{width:'100%', height:'80vh'}}>
              {view}                  
            </Grid.Row>
            <Grid.Row style={{height:"10vh"}}>
                <Grid.Column verticalAlign='middle' textAlign='right'>
                </Grid.Column>
            </Grid.Row>
          </Grid>
          <div style={{
            zIndex: 9,
            position: 'absolute',
            bottom: '2vh',
            right: '2vw'

          }}>
              <Image style={{height:'8vh'}} src='/gordium_128_name_left.png'/>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {

  const {
    jobs,
    results,
    documents,
    pipelines,
    scripts,
    pipelinesteps,
    auth } = state;

  return {
    jobs,
    results,
    scripts,
    pipelinesteps,
    documents,
    pipelines,
    auth
  }
}

export default connect(mapStateToProps)(LawyerHome)