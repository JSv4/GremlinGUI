import Cookies from 'js-cookie'

import { 
  showErrorToast,
} from './app_actions';

/*
* API Call Imports
*/
import {
  uploadDocumentRequest, 
  deleteDocumentRequest,
  downloadDocument,
  getDocumentsForJob,

  getSummaryResultsForJob,
  getResultsRequest,
  getFullResultById,
  downloadResult,
  
  getJobStepLogs,
  getJobLogs,
  getJobById,
  runJobToNode,
  updateJobRequest,

  getAllPythonScripts,
  getPythonScriptById,
  downloadPythonScript,
  uploadPythonScript,
  deletePythonScript,
  getPythonScriptDetails,
  createScript,
  updateScript,
  getPipelineScripts,
  createTestJobForPipeline,
  testNewTransformForStepResult,
  getSystemStats
} from '../Api/api';

/*
 * Test Job
 * Action constants
 */

export const RECEIVE_TEST_JOB = 'RECEIVE_TEST_JOB';
export const RELOAD_TEST_JOB = 'RELOAD_TEST_JOB';
export const RECEIVE_TEST_DOCUMENTS = 'RECEIVE_TEST_DOCUMENTS';
export const RECEIVE_TEST_RESULTS = 'RECEIVE_TEST_RESULTS';
export const UPDATE_TEST_JOB = 'UPDATE_TEST_JOB';
export const UPDATE_TEST_JOB_RESULT = 'UPDATE_TEST_JOB_RESULT';
export const CLEAR_TEST_DATA = 'CLEAR_TEST_DATA';
export const SET_TEST_DOCUMENT_PAGE = 'SET_TEST_DOCUMENT_PAGE';
export const SET_TEST_RESULT_PAGE = 'SET_TEST_RESULT_PAGE';
export const SET_TEST_JOB_LOG_LOADING = 'SET_TEST_JOB_LOG_LOADING';
export const ADD_TEST_JOB_STEP_LOG = 'ADD_TEST_JOB_STEP_LOG';
export const SET_TEST_JOB_LOG = 'SET_TEST_JOB_LOG';
export const CLEAR_TEST_JOB_LOGS = 'CLEAR_TEST_JOB_LOGS';
export const SET_TEST_LOADING = 'SET_TEST_LOADING';
export const SET_TEST_TRANSFORM_LOADING = 'SET_TEST_TRANSFORM_LOADING';
export const SET_TEST_RESULTS_LOADING = 'SET_TEST_RESULTS_LOADING';
export const SET_TEST_DOCUMENTS_LOADING = 'SET_TEST_DOCUMENTS_LOADING';

/*
* Documents
* Action constants
*/
export const ADD_DOCUMENT = 'ADD_DOCUMENT';
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'; 
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT';
export const REMOVE_DOCUMENT = 'REMOVE_DOCUMENT';
export const CLEAR_DOCUMENTS = 'CLEAR_DOCUMENTS';
export const CHANGE_DOCUMENT_PAGE = 'CHANGE_DOCUMENT_PAGE';
export const SET_DOCUMENTS_LOADING = 'SET_DOCUMENTS_LOADING';

/*
 * Results
 * Action constants
 */
export const ADD_RESULT = 'ADD_RESULT';
export const RECEIVE_RESULTS = 'RECEIVE_RESULTS';
export const UPDATE_RESULT = 'UPDATE_RESULT';
export const REMOVE_RESULT = 'REMOVE_RESULT';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const SELECT_RESULT = 'SELECT_RESULT';
export const CLEAR_SELECTED_RESULT = 'CLEAR_SELECTED_RESULT';
export const CHANGE_RESULT_PAGE = 'CHANGE_RESULT_PAGE';
export const SET_RESULTS_LOADING = 'SET_RESULTS_LOADING';
export const RECEIVE_TEST_TRANSFORM = 'RECEIVE_TEST_TRANSFORM';
export const SET_RESULTS_SEARCH_STRING = 'SET_RESULTS_SEARCH_STRING';

/*
 * File Results
 * Action constants
 */
export const RECEIVE_FILE_RESULTS = 'RECEIVE_FILE_RESULTS';
export const CLEAR_FILE_RESULTS = 'CLEAR_FILE_RESULTS';
export const CHANGE_FILE_RESULT_PAGE = 'CHANGE_FILE_RESULT_PAGE';
export const SET_FILE_RESULTS_LOADING = 'SET_FILE_RESULTS_LOADING';

/*
* Python Scripts
* Action constants
*/
export const ADD_SCRIPT = 'ADD_SCRIPT';
export const RECEIVE_SCRIPTS = 'RECIEVE_SCRIPTS';
export const UPDATE_SCRIPT = 'UPDATE_SCRIPT';
export const REMOVE_SCRIPT = 'REMOVE_SCRIPT';
export const CLEAR_SCRIPTS = 'CLEAR_SCRIPTS';
export const SELECT_SCRIPT = 'SELECT_SCRIPT';
export const CLEAR_SELECTED_SCRIPT = 'CLEAR_SELECTED_SCRIPT';
export const SET_SCRIPTS_LOADING = 'SET_SCRIPTS_LOADING';
export const SET_SCRIPT_DETAILS_LOADING = 'SET_SCRIPT_DETAILS_LOADING';
export const RECEIVE_SCRIPT_DETAILS = 'RECEIVE_SCRIPT_DETAILS';
export const REQUEST_SCRIPT_DETAILS = 'REQUEST_SCRIPT_DETAILS';

/*
* System
* Action creators
*/
export const SET_STATS_LOADING = 'SET_STATS_LOADING';
export const RECEIVE_STATS = 'RECEIVE_STATS';
export const CLEAR_STATS = 'CLEAR_STATS';

/*
* DOCUMENT
* Action creators
*/
export const uploadDocument = (file) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      dispatch({
        type: SET_DOCUMENTS_LOADING,
        loading:true
      })
      let response = await uploadDocumentRequest(file, getState().jobs.selectedJobId, Cookies.get('token'));
      if (response.status===200) {
        dispatch({
          type: SET_DOCUMENTS_LOADING,
          loading: false
        });
      }
    } 
    catch (error) {
      if (error.response) {
        dispatch(showErrorToast(error.response.data.message));
      } else {
        dispatch(showErrorToast('Something went wrong while uploading this file'));
      }
    }
  }
  return Promise.resolve();
}

export const deleteDocument = (documentId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
    
      let token = Cookies.get('token');
      let response = await deleteDocumentRequest(documentId, token);
      if (response.status===204) {
        dispatch(fetchDocuments);
        return Promise.resolve(true);      
      }
      else {
        dispatch(showErrorToast(`Unable to delete document with ID ${documentId}`));
      }
    } 
    catch (error) {
      dispatch(showErrorToast(`Error trying to delete document with ID #${documentId}`, error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const selectDocumentPage = (selectedPage) => dispatch => {
  dispatch({
    type: CHANGE_DOCUMENT_PAGE,
    selectedPage
  });
  return Promise.resolve();
}

export const clearDocuments = () => dispatch => {
  dispatch({
    type: CLEAR_DOCUMENTS,
  });
  return Promise.resolve();
}

export const receiveDocuments = (response) => dispatch => {
  dispatch({
    type: RECEIVE_DOCUMENTS,
    response: response,
  });
  return Promise.resolve();
}

export const downloadSelectedDocument = (docId) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await downloadDocument(docId, token)
                              
      if(response.status === 200) {
          // Try to find out the filename from the content disposition `filename` value
          var filename = response.headers['filename'];

          // The actual download
          var blob = new Blob([response.data], { type: response.headers['content-type'] });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    }
    catch (error) {
      dispatch(showErrorToast("Error downloading selected document: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve();
}

export const fetchDocuments = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_DOCUMENTS_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      const {selectedJobId} = getState().jobs;
      const {selectedPage} = getState().documents;

      let response = await getDocumentsForJob(selectedJobId, selectedPage, token);
      if(response.status===200) {
        dispatch(receiveDocuments(response.data));
        return Promise.resolve(true);
      }
    }    
    catch (error) {
      dispatch(showErrorToast("Error fetching documents: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

/* 
 * TEST JOB
 * Action creators
 */

export const setTestDocumentsLoading = (loading) => async dispatch => {
  dispatch({
    type: SET_TEST_RESULTS_LOADING,
    loading,
  });
  return true;
}

export const setTestResultsLoading = (loading) => async dispatch => {
  dispatch({
    type: SET_TEST_DOCUMENTS_LOADING,
    loading,
  });
  return true;
}


export const runTestJobToNode = (targetNodeId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    
    dispatch({
      type: SET_TEST_LOADING,
      loading: true,
    });  
    
    try {
  
        let token = Cookies.get('token');
        let response = await runJobToNode(getState().test_job.test_job.id, targetNodeId, token);       
        console.log("Run job to node response: ", response);

        if(response.status === 204) {
            return true;
        }
      }
      catch (error) { 
        dispatch(showErrorToast("Error start job to step: "+error));
        dispatch({
          type: SET_TEST_LOADING,
          loading: false,
        });
      }
    }
    else {
      dispatch(showErrorToast("Not logged in!"));
    }
    return false;
  }
  

export const requestCreateTestJobForPipeline = (pipelineId) => async(dispatch, getState) => {
  if (getState().auth.loggedIn) {
    
    dispatch({
      type: SET_TEST_LOADING,
      loading: true,
    });
    
    try {
      let token = Cookies.get('token');
      let response = await createTestJobForPipeline(pipelineId, token);      
      if(response.status === 200) {
        await dispatch({
          type: RECEIVE_TEST_JOB,
          test_job: response.data
        });
        return response.data;
      }
    }
    catch (error) { 
      dispatch(showErrorToast(`Error creating test job for pipeline ID #${pipelineId}: ${error}`));
      dispatch({
        type: SET_TEST_LOADING,
        loading: true,
      });
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return false;
}

export const refreshTestJob = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    
    dispatch({
      type: SET_TEST_LOADING,
      loading: true,
    });
    
    try {
      let token = Cookies.get('token');
      let response = await getJobById(getState().test_job.test_job.id, token);   
      if (response.status === 200) {
        dispatch({
          type: RECEIVE_TEST_JOB,
          test_job: response.data
        });
        return Promise.resolve(true);
      } 
      else{
        dispatch(showErrorToast("Unable to refresh test job: ", getState().test_job.test_job.id));
      }  
    } 
    catch (error) {      
      dispatch(showErrorToast("Error trying to update selected job: "+error));
      dispatch({
        type: SET_TEST_LOADING,
        loading: false,
      });
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const fetchTestDocuments = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_TEST_DOCUMENTS_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      const jobId = getState().test_job.test_job.id;
      const {document_page} = getState().test_job;

      let response = await getDocumentsForJob(jobId, document_page, token);
      if(response.status===200) {
        dispatch({
              type: RECEIVE_TEST_DOCUMENTS,
              response: response,
        });
        return Promise.resolve(true);
      }
    }    
    catch (error) {
      dispatch(showErrorToast("Error fetching test documents: "+error));
      dispatch({
        type: SET_TEST_DOCUMENTS_LOADING,
        loading: false
      });
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const uploadTestDocument = (file) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    
    try {

      dispatch({
        type: SET_TEST_DOCUMENTS_LOADING,
        loading: true
      })

      let response = await uploadDocumentRequest(file, getState().test_job.test_job.id, Cookies.get('token'));
      if (response.status===200) {
        
        dispatch({
          type: SET_TEST_DOCUMENTS_LOADING,
          loading: false
        })

        return Promise.resolve(true);
      }
    } 
    catch (error) {
      if (error.response) {
        dispatch(showErrorToast(error.response.data.message));
      } else {
        dispatch(showErrorToast('Something went wrong while uploading test file'));
      }
    }
  }
  return Promise.resolve(false);
}

export const updateTestJob = (updatedJobObj) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    
    dispatch({
      type: SET_TEST_LOADING,
      updatedJob: true
    });

    try {
      let token = Cookies.get('token');
      let response = await updateJobRequest(updatedJobObj, token);   
      if (response.status === 200) {
        dispatch({
          type: UPDATE_TEST_JOB,
          updatedJob: response.data
        });
        return Promise.resolve(true);
      } 
      else{
        dispatch(showErrorToast("Unable to refresh test job with Id: ", getState().job.id));
      }  
    } 
    catch (error) {      
      dispatch(showErrorToast("Error trying to update test job: "+error));
      dispatch({
        type: SET_TEST_LOADING,
        updatedJob: false
      });
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export function setTestResultPage(selectedPage) {
  return {
    type: SET_TEST_RESULT_PAGE,
    selectedPage
  }
}

export const setTestDocumentPage = (selectedPage) => dispatch => {
  dispatch({
    type: SET_TEST_DOCUMENT_PAGE,
    selectedPage
  });
  return Promise.resolve(true);
}

export const clearTestData = () => async (dispatch) => {
  dispatch({
    type: CLEAR_TEST_DATA,
  });
  return true;
}

export const requestTestJobLog = () => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {

      let token = Cookies.get('token');
      let jobId = getState().test_job.id;

      dispatch({
        type: SET_TEST_JOB_LOG_LOADING,
        loading: true
      })

      let response = await getJobLogs(jobId, token);

      if(response.status===200) {
        dispatch({
          type: SET_TEST_JOB_LOG,
          log: response.data.log,
        });
      }
      return Promise.resolve(true);
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch test job log: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const requestTestJobStepLog = (jobId, stepId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      
      dispatch({
        type: SET_TEST_JOB_LOG_LOADING,
        loading: true
      })

      let token = Cookies.get('token');
      let response = await getJobStepLogs(jobId, stepId, token);
      if(response.status===200) {
        dispatch({
          type: ADD_TEST_JOB_STEP_LOG,
          log: response.data.log,
          stepId
        });
      }
      return Promise.resolve(true);
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch test job step log: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export function clearTestJobLogs() {
  return {
    type: CLEAR_TEST_JOB_LOGS,
  }
}

/*
* RESULTS
* action creators
*/

export const tryTestNewTransformForStepResult = (resultId, transform) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    
    dispatch({
      type: SET_TEST_TRANSFORM_LOADING,
      loading: true
    });
    
    try {
      
      let token = Cookies.get('token');
      let response = await testNewTransformForStepResult(resultId, transform, token);
      console.log("Response is: ", response);
      if(response.status===200) {
        dispatch({
          type: RECEIVE_TEST_TRANSFORM,
          resultId,
          transformed_input: response.data.output_data
        });
      }
      return Promise.resolve(true);
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to test transform: "+error));
      dispatch({
        type: SET_TEST_TRANSFORM_LOADING,
        loading: false
      });
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
} 

export const selectResultPage = (selectedPage) => async (dispatch) => {
  return dispatch({
    type: CHANGE_RESULT_PAGE,
    selectedPage
  });
};

export function selectResult(selectedResultId) {
  return {
    type: SELECT_RESULT,
    selectedResultId
  }
}

export const downloadSelectedResult = (resultId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await downloadResult(resultId, token);
                              
      if(response.status === 200) {
          // Try to find out the filename from the content disposition `filename` value
          var filename = response.headers['filename'];

          // The actual download
          var blob = new Blob([response.data], { type: response.headers['content-type'] });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    }
    catch (error) { 
      dispatch(showErrorToast("Error trying to download result: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve();
}

export const clearResults = () => async (dispatch) => {
  dispatch({
    type: CLEAR_RESULTS,
  });
  return true;
}

export const fetchResults = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      
      dispatch({
        type: SET_RESULTS_LOADING,
        loading:true
      })

      const { selectedPage, searchString,  } = getState().results;
      
      let token = Cookies.get('token');
      let response = await getResultsRequest(selectedPage, searchString, token);

      // If we got the right response, handle results and return promise that resolves to true
      if(response.status===200) {
        dispatch({
          type: RECEIVE_RESULTS,
          response,
        });
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch results: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
} 

export const fetchSummaryResultsForJob = (jobId) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {
      
      dispatch({
        type: SET_RESULTS_LOADING,
        loading:true
      });

      let token = Cookies.get('token');
      let response = await getSummaryResultsForJob(jobId, token);
      
      if(response.status===200) {
        dispatch({
          type: RECEIVE_RESULTS,
          response,
        });
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch results: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const fetchFullResult = (resultId) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {
      
      dispatch({
        type: SET_RESULTS_LOADING,
        loading: true
      })

      let token = Cookies.get('token');
      let response = await getFullResultById(resultId, token);
      if(response.status===200) {
        dispatch({
          type: UPDATE_RESULT,
          updatedResult: response.data,
        });
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch full result: "+error));
      dispatch({
        type: SET_RESULTS_LOADING,
        loading: false
      })
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const setResultsSearchString = (searchString) => async (dispatch) => {
  return dispatch({
    type: SET_RESULTS_SEARCH_STRING,
    searchString
  });
};

/*
* python script creators
*/

export const requestDeleteScript = (scriptId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await deletePythonScript(scriptId, token);
      if(response.status===204){
        dispatch(removeScript(scriptId));
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      dispatch(showErrorToast(`Error trying to delete script with ID #${scriptId}: `+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export function removeScript(scriptId){
  return {
    type: REMOVE_SCRIPT,
    scriptId
  };
}

export const requestCreateScript = (name, type, script) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await createScript(name, type, script, token);

      if (response.status===201) {
        dispatch({
          type: ADD_SCRIPT,
          newScript: response.data
        });
        return Promise.resolve(true);
      }
      else {
        dispatch(showErrorToast("Unable to create new script with name: "+name));
      }
      return Promise.resolve(false);  
    } 
    catch (error) {
      dispatch(showErrorToast("Error creating new script: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
}

export const requestUpdateScript = (scriptObj) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_SCRIPTS_LOADING,
        loading: true
      });

      // Not sure what the best way to handle this is... there are a bunch of read-only
      // fields in the script objs returned from server. When returning updated objs, using
      // these fields causes errors... with this code I am rebuilding a valid object for posting
      // but it seems kludgy. 
      let updatedObj = {
        id: scriptObj.id,
        description: scriptObj.description,
        env_variables: scriptObj.env_variables,
        human_name: scriptObj.human_name,
        json_schema: scriptObj.json_schema,
        mode: scriptObj.mode,
        name: scriptObj.name,
        required_package: scriptObj.required_package,
        script: scriptObj.script,
        setup_script: scriptObj.setup_script,
        supported_file_types: scriptObj.supported_file_types,
        type: scriptObj.type
      }

      let token = Cookies.get('token');
      let response = await updateScript(updatedObj, token);

      if (response.status===200) {
        dispatch(updateSingleScript(response.data));
        return Promise.resolve(true);
      }
    } 
    catch (error) { 
      dispatch(showErrorToast("Error updating script: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }

  dispatch({
    type: SET_SCRIPTS_LOADING,
    loading: false
  });

  return Promise.resolve(false);
}

// Given script json, merge its fields into existing script obj in store, overwriting fields with fresh data
// but leaving existing fields untouched (And existant) where new obj doesn't have that field (so that we 
// can continue to handle script detail fetching as it works now where we initially load a json of all script
// summaries BUT, when we click on a script to show the user the details, we load the more data expensive 
// details and 
export function updateSingleScript(updatedScript) {
  return {
    type: UPDATE_SCRIPT,
    updatedScript
  };
}

export function receiveScripts(response) {
  return {
    type: RECEIVE_SCRIPTS,
    response,
    receivedAt: Date.now()
  };
}

export const refreshScriptById = (scriptId) => async(dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {

      let token = Cookies.get('token');
      let response = await getPythonScriptById(scriptId, token);
      console.log("Response from refreshScriptById: ", response);

      if (response.status===200) {
        dispatch(updateSingleScript(response.data));
        return Promise.resolve(true);
      }  
    } 
    catch (error) {
      dispatch(showErrorToast("Error fetching scripts: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const fetchPipelineScripts = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_SCRIPTS_LOADING,
        loading:true
      })

      let token = Cookies.get('token');
      let response = await getPipelineScripts(getState().pipelines.selectedPipelineId, token);

      if (response.status===200) {
        dispatch(receiveScripts(response));
        return Promise.resolve(true);
      }  
    } 
    catch (error) {
      dispatch(showErrorToast("Error fetching scripts for pipeline: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }

  dispatch({
    type: SET_SCRIPTS_LOADING,
    loading:false
  })
  return Promise.resolve(false);
}

export const fetchScripts = () => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_SCRIPTS_LOADING,
        loading:true
      })

      let token = Cookies.get('token');
      let response = await getAllPythonScripts(token);
      if (response.status===200) {
        dispatch(receiveScripts(response));
        return Promise.resolve(true);
      }  
    } 
    catch (error) {
      dispatch(showErrorToast("Error fetching scripts: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }

  dispatch({
    type: SET_SCRIPTS_LOADING,
    loading:false
  })
  return Promise.resolve(false);
}

export const selectScript = (selectedScriptId) => dispatch => {
  dispatch({
    type: SELECT_SCRIPT,
    selectedScriptId
  });
  return Promise.resolve(true);
}

export const clearSelectedScript = () => dispatch => {
  dispatch({
    type: CLEAR_SELECTED_SCRIPT,
  });
  return Promise.resolve(true);
}

export function receiveScriptDetails(response) {
  return {
    type: RECEIVE_SCRIPT_DETAILS,
    response,
  }
}

export const requestDownloadPythonScript = (scriptId) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await downloadPythonScript(scriptId, token);
                              
      if(response.status === 200) {
          // Try to find out the filename from the content disposition `filename` value
          var filename = response.headers['filename'];

          // The actual download
          var blob = new Blob([response.data], { type: response.headers['content-type'] });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return Promise.resolve(true);
      }
    }
    catch (error) { 
      dispatch(showErrorToast(`Error trying to export script ID${scriptId}: ${error}`));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

// Try to upload a script archive. NOTE - on success the selected script will be changed to id of new script.
export const requestUploadPythonScript = (file) => async (dispatch, getState) => {

  if (getState().auth.loggedIn) {
    try {
      dispatch({
        type: SET_SCRIPTS_LOADING,
        loading:true
      })
      let response = await uploadPythonScript(file, Cookies.get('token'));
      if (response.status===200) {
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      if (error.response) {
        dispatch(showErrorToast(error.response.data.message));
      } else {
        dispatch(showErrorToast('Something went wrong while uploading this script'));
      }
    }
  }
  dispatch({
    type: SET_SCRIPTS_LOADING,
    loading: false
  });
  return Promise.resolve(false);
}

export const fetchSelectedScriptDetails = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_SCRIPT_DETAILS_LOADING,
        loading:true
      });

      let token = Cookies.get('token');
      let response = await getPythonScriptDetails(token, getState().scripts.selectedScriptId);
      if (response.status===200) {
        dispatch(receiveScriptDetails(response));
      }
    } 
    catch (error) {
      dispatch(showErrorToast("Error fetching script details: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }

  dispatch({
    type: SET_SCRIPT_DETAILS_LOADING,
    loading:false
  });

}



/*
* SYSTEM STATUS
* action creators
*/
export const fetchSystemStats = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn && getState().auth.user.role !== 'LAWYER') {
    try {
      
      dispatch({
        type: SET_STATS_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      let response = await getSystemStats(token);
      console.log("Stats response", response);
      if (response.status===200) {
        dispatch({
          type: RECEIVE_STATS, 
          stats: response.data
        })
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      dispatch(showErrorToast("Error fetching script details: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not authorized!"));
  }
  
  dispatch({
    type: SET_STATS_LOADING,
    loading: false
  });

  return Promise.resolve(false);
}

export const clearStats = () => dispatch => {
  dispatch({
    type: CLEAR_STATS
  });
  return Promise.resolve(true);
}

export const setStatsLoading = (loading) => dispatch => {
  dispatch({
    type: SET_STATS_LOADING,
    loading
  });
  return Promise.resolve(true);
}

