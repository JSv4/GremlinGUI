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
  changePipelinePage,
  fetchPipelines,
  loadFullPipeline,
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
      job_input_json: {},
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

    //On the document step, refresh docs to show updates to extract.
    if(this.state.step === 3) {
      this.handleRefreshDocuments();
    } 

    //On the job step (final step), refresh results and job stat
    if (this.state.step === 4 && this.props.jobs.selectedJobId!==-1) {
      this.handleRefreshSelectedJob();
      this.handleFetchSummaryResults();
    }
    //TODO - need to rewrite step handling... also, once job is created and we hit back... need to handle that.
  }

  toggleResultModal = () => {
    if (!this.state.showResultModal) {
      if (this.props.jobs.selectedJobId) {
        let selectedJob = _.find(this.props.jobs.items, {id: this.props.jobs.selectedJobId});
        if (selectedJob && selectedJob.pipeline && selectedJob.pipeline.id) {
          this.props.dispatch(loadFullPipeline(selectedJob.pipeline.id)).then(() => {
            this.props.dispatch(fetchSummaryResultsForJob(this.props.jobs.selectedJobId)).then(() => {
              this.setState({
                showResultModal: !this.state.showResultModal
              });
            })
          });
        }
      } 
    }
    else {
      this.setState({
        showResultModal: !this.state.showResultModal
      });
    }
  }

  handleRefreshSelectedJob = () => {
    this.props.dispatch(refreshSelectedJob());
  }

  handleJobFormChange = (obj) => {
    this.setState({
      ...obj
    });
  }

  handleJobInputChange = (job_input_json) => {
    this.setState({
      job_input_json
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

    const { jobs, pipelines } = this.props;

    let selectedPipeline = null;
    try {
      selectedPipeline = _.find(pipelines.items, {id: pipelines.selectedPipelineId})
    } catch {}

    let selectedJob = null;
    try {
        selectedJob = _.find(jobs.items, {id: jobs.selectedJobId})
    } catch {}

    switch(this.state.step) {
      case 1:

        // If there's no input_json_schema... just skip the input page entirely 
        // and advance by 2 instead of 1. 
        if (selectedPipeline.input_json_schema==={}) {
          
          // In that case, create the job here. 
          if(selectedJob) {
            this.handleUpdateJob({
              name: this.state.name,
              notification_email: this.state.notification_email,
              pipeline: this.props.pipelines.selectedPipelineId,
              job_input_json: this.state.job_input_json
            }).then(() => this.setStep(this.state.step + 2));
          }
          else {
            this.handleCreateJob({
              name: this.state.name,
              notification_email: this.state.notification_email,
              pipeline: this.props.pipelines.selectedPipelineId,
              job_input_json: this.state.job_input_json
            }).then(() => this.setStep(this.state.step + 2));
          }

        }
        else{
          this.setStep(this.state.step + 1);
        }

        break;
      case 2:
        if(selectedJob) {
          this.handleUpdateJob({
            name: this.state.name,
            notification_email: this.state.notification_email,
            pipeline: this.props.pipelines.selectedPipelineId,
            job_input_json: this.state.job_input_json
          }).then(() => this.setStep(this.state.step + 1));
        }
        else {
          this.handleCreateJob({
            name: this.state.name,
            notification_email: this.state.notification_email,
            pipeline: this.props.pipelines.selectedPipelineId,
            job_input_json: this.state.job_input_json
          }).then(() => this.setStep(this.state.step + 1));
        }
        break;
      case 3:
        this.handleUpdateJob({id: this.props.jobs.selectedJobId, queued: true}).then(() => {
          this.setStep(this.state.step + 1);
        });
        break;
      case 4:
        this.handleStartWizardOver();
        break;
      default:
        this.setStep(this.state.step + 1);
    } 
  }

  reverseStep = () => {

    const { jobs, pipelines } = this.props;

    let selectedPipeline = null;
    try {
      selectedPipeline = _.find(pipelines.items, {id: pipelines.selectedPipelineId})
    } catch {}

    let selectedJob = null;
    try {
        selectedJob = _.find(jobs.items, {id: jobs.selectedJobId})
    } catch {}

    switch(this.state.step) {
      case 0:
        this.setHomeView();
        break;
      case 3:
        if(selectedPipeline.input_json_schema==={}) {
          this.setStep(this.state.step - 2);
        } else {
          this.setStep(this.state.step - 1);
        }
      default:
        this.setStep(this.state.step - 1);
    }

  }

  //Create a new job with fields in the jobObj. Then advance the wizard step to doc section.
  handleCreateJob = (jobObj) => {
    return this.props.dispatch(createJob(jobObj)).then((response) => {
      return this.props.dispatch(selectJob(response.id)).then(() => {
        return this.props.dispatch(loadFullPipeline(this.props.pipelines.selectedPipelineId));
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
      this.toggleResultModal();
    });
  }

  // Change the page # in the redux store and then refetch pipelines (pagination is injected to url
  // request automatically)
  handlePipelinePageChange = (pageNo) => {
    this.props.dispatch(changePipelinePage(pageNo)).then(() => {
      this.props.dispatch(fetchPipelines());
    });
  }

  refreshPipelines = () => {
    this.props.dispatch(fetchPipelines()); 
  }

  handleUpdateJob = (updatedJobObj, callback) => {
    return this.props.dispatch(updateJob(updatedJobObj));
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
      this.setState({
        step:0,
        name:'',
        notification_email:'',
        job_input_json: {},
      });
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

    let selectedPipeline = null;
    try {
      selectedPipeline = _.find(pipelines.items, {id: pipelines.selectedPipelineId})
    } catch {}

    let view = <></>;

    if(this.state.view==='WIZARD') {
      view = <JobWizardSegment
                pipelines={pipelines}
                jobs={jobs}
                documents={documents}
                results={results}
                job_input_json={this.state.job_input_json}
                refreshPipelines={this.refreshPipelines}
                handleUpdateJob={this.handleUpdateJob}
                selectedPipeline={selectedPipeline}
                selectedJob={selectedJob}
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
                handleJobInputChange={this.handleJobInputChange}
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
            pipelines={pipelines}
            results={results}
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
              <Image style={{height:'8vh'}} src='/os_legal_128_name_left.png'/>
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