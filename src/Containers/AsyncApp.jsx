import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Header,
  Dropdown,
  Segment,
  Image,
  Icon,
  Container,
  Menu,
  Sidebar
} from 'semantic-ui-react';
import _ from 'lodash';

import {
  clearJobs,
  createJob,
  updateJob,
  deleteJob,
  selectJob,
  clearJobLogs,
  setJobSearchString,
  selectJobPage,
  fetchJobs,
  requestJobStepLogs,
  downloadJobResultsById,
  requestSelectedJobLog,
  unselectJob
} from '../Redux/job_actions';

import {
  requestTestJobStepLog,
  requestTestJobLog,
  deleteDocument,
  uploadDocument,
  fetchDocuments,
  selectDocumentPage,
  downloadSelectedDocument,
  clearDocuments,
  fetchSummaryResultsForJob,
  clearResults,
  selectResult,
  downloadSelectedResult,
  fetchFullResult,
  fetchScripts,
  selectScript,
  refreshScriptById,
  requestCreateScript,
  requestDeleteScript,
  requestUpdateScript,
  clearSelectedScript,
  fetchSelectedScriptDetails,
  requestDownloadPythonScript,
  requestUploadPythonScript,
  requestCreateTestJobForPipeline,
  fetchTestDocuments,
  clearTestData,
  updateTestJob,
  setTestDocumentPage,
  refreshTestJob,
  runTestJobToNode,
  uploadTestDocument,
  tryTestNewTransformForStepResult,
  fetchSystemStats,
  clearStats,
} from '../Redux/actions';

import {
  fetchPipelines,
  clearPipelines,
  removePipeline,
  unselectPipeline,
  selectPipeline,
  refreshPipeline,
  loadFullPipeline,
  requestCreatePipeline,
  requestUpdatePipeline,
  requestDownloadPipelineYAML,
  requestUploadPipelineYAML,
  requestDeletePipeline,
  setPipelineSearchString
} from '../Redux/pipeline_actions';

import {
  selectPipelineStep,
  clearSelectedPipelineNode,
  requestUpdatePipelineStep,
  requestRefreshPipelineStep,
  createNewPipelineStep,
  requestDeletePipelineStep,
  fetchPipelineStepsForPipeline,
  requestAddPipelineNode,
} from '../Redux/node_actions';

import {
  createPipelineEdge,
  deletePipelineEdge
} from '../Redux/edge_actions';

import {
  changeTab,
  toggleNewJobModal,
  toggleScriptModal,
  toggleInviteUserModal,
  toggleNewScriptModal,
  toggleNewPipelineModal,
  toggleBuildMode,
  setNewJobName,
  showSuccessToast,
  showErrorToast,
  setScriptNameFilter
} from '../Redux/app_actions';

import {
  requestDeleteUserRequest,
  fetchUsers,
  selectUserPage,
  setUserNameFilter,
  inviteNewUser,
  requestChangeUserPermissions,
  changePassword,
  tryLogout
} from '../Redux/auth_actions';

import AddPipelineModal from '../Components/PipelineDigraph/components/Modals/AddPipelineModal';
import ScriptModal from '../Components/Scripts/ScriptModal';
import CreateNewScriptModal from '../Components/Scripts/CreateNewScriptModal';
import NewJobModal from '../Components/PipelineDigraph/components/Modals/NewJobModal';
import UserTab from '../Components/Users/UserTab';
import ScriptGridTab from '../Components/Scripts/ScriptGridTab';
import SettingsTab from '../Components/Settings/SettingsTab';
import PipelineDigraphTab from '../Components/PipelineDigraph/PipelineDigraphTab';
import JobDigraphTab from '../Components/JobDigraph/JobDigraphTab';
import HomeTab from '../Components/Home/HomeTab';

import withWindowDimensions from './withWindowDimensions';

class AsyncApp extends Component {

  constructor(props){
    super(props);
    this.state={
      showSidebar:false,
      timer: null,
      lastNodeMoves:{}
    };

    // Register key listeners with the diagram engine so changes to the digraph 
    // relationships and positioning can be reflected in the DB: 1) node moves,
    // 2) node deletes, 3) edges creation and 4) edge deletion 
    this.props.digraphEngine.registerNodeMoveListener(this.logMove);
    this.props.digraphEngine.registerNodeSelectedListener(this.handleNodeSelect);
    this.props.digraphEngine.registerNodeUnselectedListener(this.handleNodeUnselect);
    this.props.digraphEngine.registerNodeDeleteListener(this.handleDeletePipelineNode);
    this.props.digraphEngine.registerLinkCreateListener((args)=> {
      try{
        if (Number.isInteger(args.entity.sourcePort.parent.id) && 
              Number.isInteger(args.entity.targetPort.parent.id)) {
                let edge = {
                  parent_pipeline: this.props.pipelines.selectedPipelineId,
                  start_node: args.entity.sourcePort.parent.id,
                  end_node: args.entity.targetPort.parent.id
                };
                this.handleCreatePipelineEdge(edge, args.entity.options.id);
          }
      } catch {}
    });
    this.props.digraphEngine.registerLinkDeleteListener(this.handleDeletePipelineEdge);
  }

  ///////////////////////////////////////////////////////////////////////
  // Code to keep track of node moves and update if no moves made      //
  // within 1 seconds                                                  //
  ///////////////////////////////////////////////////////////////////////

    logMove = (node) => {

      let lastNodeMoves = {...this.state.lastNodeMoves};
      lastNodeMoves[node.id] = { x: node.position.x, y: node.position.y, lastTime: Date.now() };

      this.setState({
        lastNodeMoves
      });

    }

    syncStaleNodeMoves = () => {

      let now = Date.now();
      
      for (var key in this.state.lastNodeMoves){
        if (now - this.state.lastNodeMoves[key].lastTime > 1000) {
          this.handleUpdatePipelineStep({
            id: key,
            x_coord: this.state.lastNodeMoves[key].x,
            y_coord: this.state.lastNodeMoves[key].y
          });
          delete this.state.lastNodeMoves[key];
        }
      }

    }
  
  ///////////////////////////////////////////////////////////////////////
  // JOB Actions                                                       //
  ///////////////////////////////////////////////////////////////////////

    fetchJobs = () => {
      this.props.dispatch(fetchJobs());
    }

    // When you select a job row, clear + fetch docs, clear + fetch results, clear logs, select job 
    // pipeline. Then, when all of those are complete, show the job modal.  
    handleSelectJobRow = (jobId, pipelineId) => {
      this.props.dispatch(selectJob(jobId)).then(() => {
        Promise.all([
          this.props.dispatch(clearJobLogs()),
          this.props.dispatch(fetchDocuments()),
          this.props.dispatch(clearResults()),
          this.props.dispatch(fetchSummaryResultsForJob(jobId)),
          this.props.dispatch(selectPipeline(pipelineId))
        ]);
      });
    } 

    handleDownloadJobResult = (jobId) => {
      this.props.dispatch(downloadJobResultsById(jobId));
    }

    handleDeleteJob = (jobId) => {
      this.props.dispatch(unselectJob()).then(() => {
        this.props.dispatch(deleteJob(jobId)).then(() => {
          this.props.dispatch(fetchJobs());
          this.props.dispatch(clearResults());
          this.props.dispatch(clearDocuments());
        });
      });
    }

    handleSetJobSearchString = (searchString) => {
      this.props.dispatch(setJobSearchString(searchString));
    }

    handleSelectJobPage = (page) => {
      this.props.dispatch(selectJobPage(page)).then(() => {
        this.props.dispatch(fetchJobs());
      });
    }

    handleUpdateJob = (updatedJobObj) => {
      this.props.dispatch(updateJob(updatedJobObj));
    }

    //Create a new job with fields in the jobObj. Then fetch related docs and results. 
    //Then close the newjobmodal and, if we're not on the job tab, switch to job tab.
    handleCreateJob = (jobObj) => {
      this.props.dispatch(createJob(jobObj)).then((response) => {
        if (response) {
          this.props.dispatch(fetchJobs()).then(() => {
            this.props.dispatch(selectJob(response.id)).then(()=>{
              Promise.all([
                this.props.dispatch(fetchDocuments()), 
                this.props.dispatch(clearDocuments()),
                this.props.dispatch(clearResults()),
                this.props.dispatch(toggleNewJobModal())
              ]);
            });
          });
        }
      });
    }

    handleFetchJobStepLog = (jobId, stepId) => {
      this.props.dispatch(requestJobStepLogs(jobId, stepId));
    }

    handleFetchJobLog = () => {
      this.props.dispatch(requestSelectedJobLog());
    }

    handleClearLogs = () => {
      this.props.dispatch(clearJobLogs());
    }

  ///////////////////////////////////////////////////////////////////////
  // APP Actions
  ///////////////////////////////////////////////////////////////////////
    
    handleUpdateNewJobName = (newJobName) => {
      this.props.dispatch(setNewJobName(newJobName));
    }

    showSidebar = (show) => {
      this.setState({showSidebar: show});
    }

    handleRefreshSystemStats = () => {
      this.props.dispatch(fetchSystemStats());
    }

    handleRefreshSystemStats = () => {
      this.props.dispatch(clearStats());
    }

    handleShowSuccessToast = (message) => {
      this.props.dispatch(showSuccessToast(message));
    }

    handleShowErrorToast = (message) => {
      this.props.dispatch(showErrorToast(message));
    }

    handleNewJobModalToggle = () => {
      this.props.dispatch(toggleNewJobModal());
    }
  
    handleScriptModalToggle = () => {
      this.props.dispatch(toggleScriptModal());
    }
  
    handleToggleInviteUserModal = () => {
      this.props.dispatch(toggleInviteUserModal());
    }

    handleNewScriptModalToggle = () => {
      this.props.dispatch(toggleNewScriptModal());
    }
  
    handleNewPipelineModalToggle = () => {
      this.props.dispatch(toggleNewPipelineModal());
    }

    handleTabChange = (newTabIndex, action) => {
      this.props.dispatch(changeTab(newTabIndex)).then(() => {
        if (action) {
          action();
        }
      });
    }

  ///////////////////////////////////////////////////////////////////////
  // AUTH Actions
  ///////////////////////////////////////////////////////////////////////

   handleLogout = () => {
    Promise.all([
      this.props.dispatch(clearDocuments()),
      this.props.dispatch(clearResults()),
      this.props.dispatch(clearJobs()),
      this.props.dispatch(clearPipelines()),
      this.props.dispatch(clearSelectedPipelineNode()),
      this.props.dispatch(clearStats())
    ]).then(() => {
      this.props.dispatch(tryLogout());
    });
  }

  ///////////////////////////////////////////////////////////////////////
  // TEST Actions
  ///////////////////////////////////////////////////////////////////////

    handleToggleBuildMode = () => {   
      this.props.dispatch(toggleBuildMode()).then(() => {
        // If, after toggling, we're now in buildMode, create a test job.
        if (this.props.application.buildMode) {
          this.handleCreateTestJob(this.props.pipelines.selectedPipelineId);    
        } 
        // Otherwise, we've just exited buildMode and should clean up the test data
        else {
            this.clearTestData();
        }
      });
    }

    handleFetchTestJobStepLog = (jobId, stepId) => {
      this.props.dispatch(requestTestJobStepLog(jobId, stepId));
    }

    handleFetchTestJobLog = () => {
      this.props.dispatch(requestTestJobLog());
    }

    handleTestTransformForResult = (resultId, transform) => {
      this.props.dispatch(tryTestNewTransformForStepResult(resultId, transform));
    }

    refreshTestDocuments = () => {
      this.props.dispatch(fetchTestDocuments());
    }
  
    refreshSummaryTestResults = () => {
      this.props.dispatch(fetchSummaryResultsForJob(this.props.test_job.test_job.id));
    }

    handleUploadTestDocument = (file) => {
      this.props.dispatch(uploadTestDocument(file)).then(() => {
        this.props.dispatch(fetchTestDocuments());
      });
    }

    handleTestDocumentPageChange = (documentPage) => {
      this.props.dispatch(setTestDocumentPage(documentPage)).then(() => {
        this.props.dispatch(fetchTestDocuments());
      });
    }
  
    handleDeleteTestDocument = (docId) => {
      this.props.dispatch(deleteDocument(docId)).then(() => {
        this.props.dispatch(fetchTestDocuments());
      });
    }

    handleCreateTestJob = (pipelineId) => {
      this.clearTestData();
      this.props.dispatch(requestCreateTestJobForPipeline(pipelineId)).then((result) => {
        if(result.id) {
          this.updateTestDocuments();
          this.props.dispatch(fetchSummaryResultsForJob(result.id));
        }
      });
    }
  
    handleRunTestJobToNode = (nodeId) => {
      this.props.dispatch(runTestJobToNode(nodeId));
    }
  
    handleUpdateTestJob = (updatedJobObj) => {
      this.props.dispatch(updateTestJob(updatedJobObj));
    }
  
    handleRefreshTestJob = () => {
      this.props.dispatch(refreshTestJob());
    }
  
    updateTestDocuments = () => {
      this.props.dispatch(fetchTestDocuments());
    }
  
    clearTestData = () => {
      this.props.dispatch(clearTestData()).then(() => {
        this.props.dispatch(clearResults());
      });
    }  

  ///////////////////////////////////////////////////////////////////////
  // USER Actions
  ///////////////////////////////////////////////////////////////////////

    // Change the page # in the redux store and then refetch users (pagination is injected to url
    // request automatically)
    handleUserPageChange = (pageNo) => {
      this.props.dispatch(selectUserPage(pageNo)).then(() => {
        this.props.dispatch(fetchUsers());
      });
    }

    handleChangeUserPermissions = (userId, newRole) => {
      this.props.dispatch(requestChangeUserPermissions(userId, newRole)).then(() => {
        this.props.dispatch(fetchUsers());
      });
    }

    handleSetUserNameFilter = (userName) => {
      this.props.dispatch(setUserNameFilter(userName));
    }

    handleFetchUsers = () => {
      this.props.dispatch(fetchUsers());
    }

    handleInviteUser = (userObjData) => {
      this.props.dispatch(inviteNewUser(userObjData)).then(() => {
        this.handleToggleInviteUserModal();
      });
    }

    handleChangePassword = (old_password, new_password) => {
      return this.props.dispatch(changePassword(old_password, new_password));
    }

    handleDeleteUser = (userId) => {
      this.props.dispatch(requestDeleteUserRequest(userId));
    }

    SetUserNameFilter = (filter) => {
      this.props.dispatch(setUserNameFilter(filter));
    }

///////////////////////////////////////////////////////////////////////
// PIPELINE Actions
///////////////////////////////////////////////////////////////////////

  setPipelineNameFilter = (filterString) => {
    this.props.dispatch(setPipelineSearchString(filterString));
  }

  handleSelectPipelineRow = (pipelineId) => {
    this.props.dispatch(selectPipeline(pipelineId)).then(() => {
      this.props.dispatch(loadFullPipeline(pipelineId));
    });
  }

  fetchPipelines = () => {
    this.props.dispatch(fetchPipelines());
  }

  refreshSelectedPipelineDigraph = () => {
    try {
      this.props.dispatch(loadFullPipeline(this.props.pipelines.selectedPipelineId));
    }
    catch (exception) {
      console.log("Unabe to refresh selected pipeline digraph:", exception);
    }
  }

  handleUploadPipeline = (file) => {
    this.props.dispatch(requestUploadPipelineYAML(file));
  }

  handleCreatePipeline = (pipelineObj) => {
    this.props.dispatch(requestCreatePipeline(pipelineObj));
  }

  handleDeletePipeline = (pipelineId) => {
    this.props.dispatch(requestDeletePipeline(pipelineId)).then((successId) => {
      this.props.dispatch(removePipeline(successId));
    })
  }

  handleUpdatePipeline = (pipelineObj) => {
    this.props.dispatch(requestUpdatePipeline(pipelineObj)).then(() => {
      this.props.dispatch(refreshPipeline(pipelineObj.id));  
    });
  }

  handleDownloadPipeline = (pipelineId) => {
    this.props.dispatch(requestDownloadPipelineYAML(pipelineId));
  }

  handleUnselectPipeline = () => {
    this.props.dispatch(unselectPipeline()).then(() => {
      this.props.digraphEngine.clearAllValues();
    });
  }

  handleSelectPipeline = (pipelineId) => {
    return this.props.dispatch(selectPipeline(pipelineId)).then(() => {
      this.props.dispatch(loadFullPipeline(pipelineId)).then(() => {
        this.props.digraphEngine.renderPipeline();
      })
    });
  }

  handleSelectResult = (selectedResultId) => {
    this.props.dispatch(selectResult(selectedResultId));
  }

///////////////////////////////////////////////////////////////////////
// RESULT Actions                                                    //
///////////////////////////////////////////////////////////////////////

  handleDownloadResult = (resultId) => {
    this.props.dispatch(downloadSelectedResult(resultId));
  }

  handleFetchFullResultData = (resultId) => {
    this.props.dispatch(fetchFullResult(resultId));
  }

  handleFetchSummaryResults = () => {
    this.props.dispatch(fetchSummaryResultsForJob(this.props.jobs.selectedJobId));
  }

///////////////////////////////////////////////////////////////////////
// DOCUMENTS Actions                                                 //
///////////////////////////////////////////////////////////////////////

  handleUploadDocument = (file) => {
    this.props.dispatch(uploadDocument(file)).then(() => {
      this.props.dispatch(fetchDocuments());
    });
  }

  handleDownloadDocument = (docId) => {
    this.props.dispatch(downloadSelectedDocument(docId));
  }

  handleDocumentDelete = (docId) => {
    this.props.dispatch(deleteDocument(docId));
  }

  handleDocumentPageChange = (documentPage) => {
    this.props.dispatch(selectDocumentPage(documentPage));
    this.props.dispatch(fetchDocuments());
  }

///////////////////////////////////////////////////////////////////////
// SCRIPTS Actions                                                   //
///////////////////////////////////////////////////////////////////////

  SetScriptNameFilter = (filter) => {
    this.props.dispatch(setScriptNameFilter(filter));
  }

  handleDownloadScript = (scriptId) => {
    this.props.dispatch(requestDownloadPythonScript(scriptId));
  }

  handleUploadScript = (file) => {
    this.props.dispatch(requestUploadPythonScript(file)).then(() => {
      this.props.dispatch(fetchScripts());
    });
  }

  handleScriptSelect = (selectedScriptId) => {
    this.props.dispatch(selectScript(selectedScriptId)).then(() => {
      this.props.dispatch(fetchSelectedScriptDetails()).then(()=> {
        this.props.dispatch(toggleScriptModal());        
      });
    }); 
  }

  handleFetchScripts = () => {
    this.props.dispatch(fetchScripts());
  }

  handleRefreshScript = (scriptId) => {
    this.props.dispatch(refreshScriptById(scriptId));
  }

  handleDeleteScript = (scriptId) => {
    this.props.dispatch(requestDeleteScript(scriptId));
  }

  handleClearScript = () => {
    this.props.dispatch(clearSelectedScript());
  }

  handleUpdateScript = (updatedScriptObj) => {
    this.props.dispatch(requestUpdateScript(updatedScriptObj));
  }

  handleCreateScript = (name, type, script) => {
    this.props.dispatch(requestCreateScript(name, type, script));
  }

///////////////////////////////////////////////////////////////////////
// NODE Actions (Slowly changing naming over from pipeline step)     //
///////////////////////////////////////////////////////////////////////

  handleNodeSelect = (id) => {
    this.props.dispatch(selectPipelineStep(id)).then(() => {
      this.props.dispatch(requestRefreshPipelineStep(id))
    });
  }

  handleNodeUnselect = () => {
    this.props.dispatch(clearSelectedPipelineNode());
  }

  handleCreatePipelineStep = (name, script, pipeline, step_settings, step_number) => {
    this.props.dispatch(createNewPipelineStep(name, script, pipeline, step_settings, step_number)).then(() => {
      this.RefreshPipelineModal();
    });
  }

  refreshPipelineStepsForSelectedPipeline = () => {
      this.props.dispatch(fetchPipelineStepsForPipeline(this.props.pipelines.selectedPipelineId));
  }

  handleUpdatePipelineStep = (updatedObj) => {
    this.props.dispatch(requestUpdatePipelineStep(updatedObj)).then(() => {
      this.props.dispatch(requestRefreshPipelineStep(updatedObj.id));
    });
  }

  // This is ONLY called from within the react-diagram view. After model is created on Gremlin, 
  // the id received from Gremlin is injected into the link model in react-diagrams. That way, 
  // if the user deletes the edge before reloading the graph, we have a valid Gremlin Id to delete
  // in the DB.
  handleCreatePipelineEdge = (edge, reactDiagramId) => {
    this.props.dispatch(createPipelineEdge(edge)).then((data) => {
      this.props.digraphEngine.linkInjectGremlinId(reactDiagramId, data.id);
    });
  }

  // Nothing fancy here. Delete edge in DB. This action will also remove the edge from the reducer.
  handleDeletePipelineEdge = (edgeId) => {
    this.props.dispatch(deletePipelineEdge(edgeId));
  }

  // Create pipeline node on the backend and, once successful, load it into the render engine and display
  handleAddPipelineNode = async (name, script, step_settings) => {
    let node = await this.props.dispatch(requestAddPipelineNode(name, script, step_settings));
    if (node) {
      try{
        this.props.digraphEngine.handleCreateNode(node.id, node.name, node.x_coord, node.y_coord);
        this.props.digraphEngine.repaint();
      }
      catch(err) {
        console.log("Error creating node: ", err);
      }
    }
    else {
      console.log("Error creating node on backend");
    }
  }

  // Delete node (which will also remove it from reducer since we always load ALL valid nodes for a give pipeline)
  // so, once one is deleted, no worries about pagination or the like and can safely remove it from list.
  handleDeletePipelineNode = (pipelineNodeId) => {
    this.props.dispatch(requestDeletePipelineStep(pipelineNodeId));
  }

  handleRefreshPipelineStep = (pipelineStepId) => {
    this.props.dispatch(requestRefreshPipelineStep(pipelineStepId));
  }

  handleRequestPipelineStepDelete = (pipelineStepId) => {
    this.props.dispatch(requestDeletePipelineStep(pipelineStepId)).then(() => {
      this.RefreshPipelineModal();
    });
  }

///////////////////////////////////////////////////////////////////////
// OTHER Actions                                                     //
///////////////////////////////////////////////////////////////////////

  requestHomeViewDataRefresh = () => {
    this.props.dispatch(fetchSystemStats());  
  }

///////////////////////////////////////////////////////////////////////
//                   ---- React Component ----                       //
///////////////////////////////////////////////////////////////////////

  // Grab home data when AsyncApp mounts (engineer and admin views).
  componentDidMount() {
    this.requestHomeViewDataRefresh();

    // Setup the background timer that runs ever second which we'll use
    //  to do various checks and updates if necessary
    let timer = setInterval(this.tick, 2000);
    this.setState({timer});
  }

  tick = () => {
    this.syncStaleNodeMoves();
  }

  render() {

    const {
      pipelines,
      pipelinesteps,
      jobs,
      users,
      test_job,
      scripts,
      results,
      application,
      system,
      auth,
      windowHeight
    } = this.props;

    const {role} = auth.user;


    // Default Display
    let DisplayPane = <></>;

    switch(application.selectedTabIndex) {
      case(0):
        DisplayPane = 
        (
          <Container style={{width:'100vw', height:'100%'}}>
            <HomeTab 
              system={system}
              handleRefreshSystemStats={this.handleRefreshSystemStats}
              handleNewJobModalToggle={this.handleNewJobModalToggle}
            />
          </Container>
        );
        break;
      case(1):
        DisplayPane = 
        (
          <JobDigraphTab
            fetchJobs={this.fetchJobs}
            digraphEngine={this.props.digraphEngine}
            handleSelectJobPage={this.handleSelectJobPage}
            handleFetchJobLog={this.handleFetchJobLog}
            handleFetchJobStepLog={this.handleFetchJobStepLog}
            handleDeleteJob={this.handleDeleteJob}    
            handleSelectJobRow={this.handleSelectJobRow}
            handleDownloadResult={this.handleDownloadResult}
            handleFetchResultData={this.handleFetchFullResultData}
            handleFetchScripts={this.handleFetchScripts}
            fetchPipelines={this.fetchPipelines}
            handleDownloadJob={this.handleDownloadJobResult}
            handleDownloadDocument={this.handleDownloadDocument}
            handleScriptSelect={this.handleScriptSelect}
            handleDocumentDelete={this.handleDocumentDelete}
            handleUploadDocument={this.handleUploadDocument}
            handleUpdateJob={this.handleUpdateJob}
            handleNewJobModalToggle={this.handleNewJobModalToggle}
            handleSetJobSearchString={this.handleSetJobSearchString}
            handleDocumentPageChange={this.handleDocumentPageChange}
          />
        );
        break;
      case(2):
        DisplayPane = 
        (
          <Container style={{width:'100vw'}}>
            <PipelineDigraphTab
              windowHeight={windowHeight} 
              digraphEngine={this.props.digraphEngine}
              user = {auth.user}
              pipelines={pipelines}
              scripts={scripts}
              results={results}
              test_job={test_job}
              pipelinesteps={pipelinesteps}
              fetchPipelines={this.fetchPipelines}
              handleDownloadJobResult={this.handleDownloadJobResult}
              handleUpdateJob={this.handleUpdateJob}
              handleUpdateTestJob = {this.handleUpdateTestJob}
              handleFetchResultData={this.handleFetchFullResultData}
              handleRunTestJobToNode = {this.handleRunTestJobToNode}
              handleRefreshTestJob = {this.handleRefreshTestJob}
              handleFetchTestResultData={this.handleFetchTestResultData}
              handleFetchScripts={this.handleFetchScripts}
              handleTestTransformForResult={this.handleTestTransformForResult}
              refreshTestDocuments={this.refreshTestDocuments}
              refreshSummaryTestResults={this.refreshSummaryTestResults}
              refreshSelectedPipelineDigraph = {this.refreshSelectedPipelineDigraph}
              handleScriptSelect={this.handleScriptSelect}
              handleSelectPipeline={this.handleSelectPipeline}
              handleUploadPipeline={this.handleUploadPipeline}
              handleUnselectPipeline={this.handleUnselectPipeline}
              selectedPipelineId={pipelines.selectedPipelineId}
              handlePipelineStepSelect={this.handleNodeSelect}
              handleDownloadPipeline={this.handleDownloadPipeline}
              selectedPipelineStepId={pipelinesteps.selectedPipelineStepId}
              handleAddPipelineNode={this.handleAddPipelineNode}
              refreshPipelineStepsForSelectedPipeline={this.refreshPipelineStepsForSelectedPipeline}
              handleUpdatePipelineStep={this.handleUpdatePipelineStep}
              handleUpdatePipeline={this.handleUpdatePipeline}
              handleDeletePipelineNode={this.handleDeletePipelineNode}
              handleCreatePipelineEdge={this.handleCreatePipelineEdge}
              handleDeletePipelineEdge={this.handleDeletePipelineEdge}
              handleDeletePipeline={this.handleDeletePipeline}
              handleNewPipelineModalToggle={this.handleNewPipelineModalToggle}
              setPipelineNameFilter={this.SetPipelineNameFilter}
              filterValue={application.pipelineNameFilter}
              handleCreateTestJob={this.handleCreateTestJob}
              handleDeleteTestDocument={this.handleDeleteTestDocument}
              handleUploadTestDocument={this.handleUploadTestDocument}
              handleDownloadDocument={this.handleDownloadDocument}
              clearTestData = {this.clearTestData}
              handleFetchTestJobStepLog={this.handleFetchTestJobStepLog}
              handleFetchTestJobLog={this.handleFetchTestJobLog}
              buildMode={application.buildMode}
              handleToggleBuildMode={this.handleToggleBuildMode}
              handleTestDocumentPageChange ={this.handleTestDocumentPageChange}
            />
          </Container>
        );
        break;
      case(3):
        DisplayPane = 
        (
          <Container style={{width:'100vw'}}>
            <ScriptGridTab
              pipelines={pipelines}
              pipelinesteps={pipelinesteps}
              scripts={scripts}
              handleScriptSelect={this.handleScriptSelect}
              handleCreateScript={this.handleCreateScript}
              handleUpdateScript={this.handleUpdateScript}
              handleDownloadScript={this.handleDownloadScript}
              handleUploadScript={this.handleUploadScript}
              handleDeleteScript={this.handleDeleteScript}
              handleChangeScriptNameFilter={this.SetScriptNameFilter}
              handleNewScriptModalToggle={this.handleNewScriptModalToggle}
              handleScriptModalToggle={this.handleScriptModalToggle}
              nameFilterValue={application.scriptNameFilter}
            />
            </Container>
        );
        break;
      case 4:
        DisplayPane = 
        (
          <Container style={{width:'100vw'}}>
              <SettingsTab 
                user = {auth.user}
                users = {users}
                handleCreateUser = {this.handleInviteUser}
                handleChangePassword = {this.handleChangePassword}
              />
          </Container>
        );
        break;
      case 5:
          DisplayPane = 
          (
            <Container style={{width:'100vw'}}>
              <UserTab
                users={users}
                handleCreateUser={this.handleInviteUser}
                handleFetchUsers={this.handleFetchUsers}
                handleUserPageChange={this.handleUserPageChange}
                handleFilterUserName={this.handleFilterUserName} 
                handleDeleteUser={this.handleDeleteUser}
                showInviteModal={application.showInviteUserModal}
                handleToggleInviteUserModal={this.handleToggleInviteUserModal}
                handleSetUserNameFilter={this.handleSetUserNameFilter}
                handleChangeUserPermissions={this.handleChangeUserPermissions}
              />
            </Container>
          );
          break;
      default:
        break;
    }

    const SidebarButtons = [
      <Menu.Item key="sidebar_button_0" as='a' onClick={() => this.handleTabChange(0, this.handleRefreshSystemStats)}>
        <Icon name='dashboard'/>
        Dashboard
      </Menu.Item>,
      <Menu.Item key="sidebar_button_1" as='a' onClick={() => this.handleTabChange(1)}>
        <Icon name='briefcase' />
        Jobs
      </Menu.Item>
    ];

    if(role==="ADMIN" || role==="LEGAL_ENG") {
      SidebarButtons.push
      ( 
        <Menu.Item
          key={`sidebar_button_${SidebarButtons.length+1}`}
          as='a'
          onClick={() => this.handleTabChange(2)}
        >
          <Icon name='code branch'/>
          Pipelines
        </Menu.Item>
      );
      SidebarButtons.push
      ( 
        <Menu.Item
          key={`sidebar_button_${SidebarButtons.length+1}`}
          as='a'
          onClick={() => this.handleTabChange(3, () => this.props.dispatch(fetchScripts()))}
        >
          <Icon name='code' />
          Scripts
        </Menu.Item>
      );
    }
    SidebarButtons.push
    (
      <Menu.Item 
        key={`sidebar_button_${SidebarButtons.length+1}`}
        as='a'
        onClick={() => this.handleTabChange(4)}
      >
        <Icon name='settings' />
        Settings
      </Menu.Item>
    );  

    // Certain admin-only GUI elements (to administer docs and users on the platform)
    if(role==="ADMIN") {
      SidebarButtons.push
      (
        <Menu.Item 
          key={`sidebar_button_${SidebarButtons.length+1}`}
          as='a'
          onClick={() => this.handleTabChange(5)}
        >
          <Icon name='user circle' />
          Users
        </Menu.Item>
      ); 
    }

    return (
      <>
        <NewJobModal
          application={application}
          jobs={jobs}
          pipelines={pipelines}
          clearPipeline={clearPipelines}
          visible={application.showNewJobModal}
          handleNewJobModalToggle={this.handleNewJobModalToggle}
          handleUpdateNewJobName={this.handleUpdateNewJobName}
          handleCreateJob={this.handleCreateJob}
          handleSelectPipeline={this.handleSelectPipeline}
        />
        <CreateNewScriptModal
          visible={application.showNewScriptModal}
          objectType='Script'
          handleCreate={this.handleCreateScript}
          toggleModal={() => this.handleNewScriptModalToggle()}
        />
        <ScriptModal 
          visible = {application.showScriptModal}
          handleScriptModalToggle={this.handleScriptModalToggle}
          selectedScriptData = {scripts.selectedScriptData}
          loading = {scripts.loading}
          windowHeight = {windowHeight}
          detailsAreFetching = {scripts.detailsAreFetching}
          handleUpdateScript = {this.handleUpdateScript}
          handleDeleteScript = {this.handleDeleteScript}
          handleClearScript = {this.handleClearScript}
          handleRefreshScript = {this.handleRefreshScript}
        />
        <AddPipelineModal
          visible={application.showNewPipelineModal}
          handleNewPipelineModalToggle={this.handleNewPipelineModalToggle}
          handleCreatePipeline={this.handleCreatePipeline}
        />
        <Menu inverted style={{borderRadius: "0px", height:'8vh', margin:'0px', padding:'0px'}}>
          <Menu.Item
            style={{width:"8vw"}}
            header
            onClick={() => this.setState({showSidebar: !this.state.showSidebar})}
          >
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
              <div>
                <Image style={{maxHeight:'5vh', paddingRight:'.5vw'}} src='/gremlin_inverted_128.png' />
              </div>
              <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <div>
                  <Header textAlign='center' size='small' inverted>
                    GREMLIN
                  </Header>
                </div>
              </div>
            </div>
          </Menu.Item> 
          <Container fluid>          
            <Menu.Menu
              position='right'
            >
              <div style={
                {
                  display:'flex',
                  flexDirection:'colomn',
                  justifyContent:'center',
                  alignItems:'center',
                  height: '100%'
                }
              }>
                <div>
                  <Header style={{marginRight:'1vw'}}>
                    <Icon inverted name='user circle outline' />
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
            </Menu.Menu>
          </Container>
        </Menu>
        <Sidebar.Pushable style={{height: '92vh', width:'100vw', padding:'0px'}}>
          <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            onHide={() => this.showSidebar(false)}
            vertical
            visible={this.state.showSidebar}
            style={{height: '100%', width:'8vw'}}
          >
            {SidebarButtons}
            <div style={{
              position:'absolute',
              width:'100%',
              bottom:'2vh',
              display:'flex',
              direction:'row',
              justifyContent:'center',
              alignItems:'center'
            }}>
                <Image style={{width:'4vw'}} src='/gordium_128_name_left.png'/>
            </div>
          </Sidebar>
          <Sidebar.Pusher 
            style={this.state.showSidebar ? {height: '92vh', transform: 'translate3d(8vw, 0px, 0px)'} : {height: '92vh'}}
            dimmed={this.state.showSidebar}>
              <Segment style={{width:'100%', height:'100%'}}>
                {DisplayPane}
              </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
    </>);
  }
}

function mapStateToProps(state) {

  const { loggedIn, username } = state.auth;
  const { 
    jobs,
    users,
    test_job,
    results,
    documents,
    pipelines,
    scripts,
    pipelinesteps,
    edges,
    application,
    system,
    auth } = state;

  return {
    jobs,
    users,
    test_job,
    results,
    scripts,
    pipelinesteps,
    edges,
    documents,
    pipelines,
    loggedIn,
    username,
    application,
    system,
    auth
  }
}

export default connect(mapStateToProps)(withWindowDimensions(AsyncApp));