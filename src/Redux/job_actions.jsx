import Cookies from 'js-cookie'

import { 
  showErrorToast,
} from './app_actions';

/*
* API Call Imports
*/
import {
  deleteJobRequest,
  downloadJob,
  getJobStepLogs,
  getJobLogs,
  getJobs,
  createJobRequest,
  getJobById,
  updateJobRequest,
} from '../Api/api';

/*
* Jobs
* Action constants
*/
export const ADD_JOB = 'ADD_JOB';
export const RECEIVE_JOBS = 'RECIEVE_JOBS';
export const UPDATE_JOB = 'UPDATE_JOB';
export const REMOVE_JOB = 'REMOVE_JOB';
export const CLEAR_JOBS = 'CLEAR_JOBS';
export const SELECT_JOB = 'SELECT_JOB';
export const UNSELECT_JOB = 'UNSELECT_JOB';
export const CLEAR_SELECTED_JOB = 'CLEAR_SELECTED_JOB';
export const CHANGE_JOB_PAGE = 'CHANGE_JOB_PAGE';
export const SET_JOB_SEARCH_STRING = 'SET_JOB_SEARCH_STRING';
export const SET_JOBS_LOADING = 'SET_JOBS_LOADING';
export const SET_JOB_LOG_LOADING = 'SET_JOB_LOG_LOADING';
export const CLEAR_JOB_LOGS = 'CLEAR_JOB_LOGS';
export const ADD_JOB_STEP_LOG = 'ADD_JOB_STEP_LOG';
export const SET_JOB_LOG = 'SET_JOB_LOG';

/*
* JOB
* Action creators
*/

export const selectJob = (selectedJobId) => async dispatch => {
  dispatch({
    type: SELECT_JOB,
    selectedJobId
  });
  return true;
}

export const unselectJob = () => dispatch => {
    dispatch({
      type: UNSELECT_JOB,
    });
    return Promise.resolve(true);
  }

export const clearJobs = () => dispatch => {
  dispatch({
    type: CLEAR_JOBS
  });
  return Promise.resolve(true);
}

export const refreshSelectedJob = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await getJobById(getState().jobs.selectedJobId, token);   
      if (response.status === 200) {
        dispatch({
          type: UPDATE_JOB,
          updatedJob: response.data
        });
        return Promise.resolve(true);
      } 
      else{
        dispatch(showErrorToast("Unable to update job with ID #", getState().jobs.selectedJobId));
      }  
    } 
    catch (error) {      
      dispatch(showErrorToast("Error trying to update selected job"));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const downloadJobResultsById = (jobId) => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await downloadJob(jobId, token);
                              
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
      dispatch(showErrorToast("Error trying to download selected job's results"));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const createJob = (jobObj) => async(dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await createJobRequest(jobObj, token);      
      
      if(response.status === 201) {
        dispatch({
          type: ADD_JOB,
          newJob: response.data
        });
        return Promise.resolve(response.data);
      }
    }
    catch (error) { 
      dispatch(showErrorToast("Error creating job"));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const fetchJobs = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_JOBS_LOADING,
        loading: true
      });
      
      let { selectedPage, searchString } = getState().jobs;
      let token = Cookies.get('token');
      let response = await getJobs(selectedPage, searchString, token);       
      
      if(response.status && response.status === 200) {
        dispatch({
            type: RECEIVE_JOBS,
            response
          });
          return Promise.resolve(true);
      } 
    }
    catch (error) { 
      dispatch(showErrorToast("Error getting jobs"));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const setJobSearchString = (searchString) => async (dispatch) => {
  return dispatch({
    type: SET_JOB_SEARCH_STRING,
    searchString
  });
};

export const selectJobPage = (selectedPage) => async (dispatch) => {
  return dispatch({
    type: CHANGE_JOB_PAGE,
    selectedPage
  });
};

export const updateJob = (updatedJobObj) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await updateJobRequest(updatedJobObj, token);   
      if (response.status === 200) {
        dispatch({
          type: UPDATE_JOB,
          updatedJob: response.data
        });
        return Promise.resolve(true);
      } 
      else{
        dispatch(showErrorToast("Unable to update job"));
      }  
    } 
    catch (error) {      
      dispatch(showErrorToast("Error updating job."));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const deleteJob = (jobId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
    
      let token = Cookies.get('token');
      let response = await deleteJobRequest(jobId, token);
        
      if(response.status === 204) {        
        dispatch({
          type: REMOVE_JOB,
          jobId
        });
        return Promise.resolve(true);
      }
    }
    catch (error) {
      dispatch(showErrorToast("Error trying to delete job: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const requestSelectedJobLog = () => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_JOB_LOG_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      let jobId = getState().jobs.selectedJobId;

      let response = await getJobLogs(jobId, token);

      if(response.status===200) {
        dispatch({
          type: SET_JOB_LOG,
          log: response.data.log,
        });
      }
      return Promise.resolve(true);
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch log: "+error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false); 
}

export function clearJobLogs() {
  return {
    type: CLEAR_JOB_LOGS,
  }
}

export const requestJobStepLogs = (jobId, stepId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
      
      dispatch({
        type: SET_JOB_LOG_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      let response = await getJobStepLogs(jobId, stepId, token);
      if(response.status===200) {
        dispatch({
          type: ADD_JOB_STEP_LOG,
          log: response.data.log,
          stepId
        });
        return Promise.resolve(true);
      }
    } 
    catch (error) {
      dispatch(showErrorToast("Error trying to fetch logs for job."));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}