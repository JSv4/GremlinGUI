import { toast } from 'react-toastify';

/*
* Application UI Global State
* Action constants
*/
export const UPDATE_NEW_JOB_NAME = 'UPDATE_NEW_JOB_NAME';
export const NEW_JOB_MODAL_TOGGLE = 'NEW_JOB_MODAL_TOGGLE';
export const SCRIPT_MODAL_TOGGLE = 'SCRIPT_MODAL_TOGGLE';
export const NEW_SCRIPT_MODAL_TOGGLE = 'NEW_SCRIPT_MODAL_TOGGLE';
export const PIPELINE_MODAL_TOGGLE = 'PIPELINE_MODAL_TOGGLE';
export const NEW_PIPELINE_MODAL_TOGGLE = 'NEW_PIPELINE_MODAL_TOGGLE';
export const INVITE_USER_MODAL_TOGGLE = 'INVITE_USER_MODAL_TOGGLE';
export const LOGIN_MODAL_TOGGLE = 'LOGIN_MODAL_TOGGLE';
export const SELECT_TAB = 'SELECT_TAB';
export const UPDATE_JOB_NAME_FILTER = 'UPDATE_JOB_NAME_FILTER';
export const UPDATE_SCRIPT_NAME_FILTER = 'UPDATE_SCRIPT_NAME_FILTER';
export const UPDATE_PIPELINE_NAME_FILTER = 'UPDATE_PIPELINE_NAME_FILTER';
export const SHOW_ERROR_JOBS = "SHOW_ERROR_JOBS";
export const SHOW_STARTED_JOBS = "SHOW_STARTED_JOBS";
export const SHOW_QUEUED_JOBS = "SHOW_QUEUED_JOBS";
export const SHOW_FINISHED_JOBS = "SHOW_FINISHED_JOBS";
export const TOGGLE_BUILD_MODE = "TOGGLE_BUILD_MODE";

/*
* Application State
* Action creators
*/

export const showSuccessToast = (message) => async (dispatch, getState) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER
    });
  }
  
  export const showErrorToast = (message) => async (dispatch, getState) => {
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER
    });
  }
  
  export const changeTab = (selectedTabIndex) => dispatch => {
    dispatch({
      type: SELECT_TAB,
      selectedTabIndex
    });
    return Promise.resolve(true);
  }
  
  export function toggleNewJobModal() {
    return {
      type: NEW_JOB_MODAL_TOGGLE
    }
  }
  
  export function toggleNewPipelineModal() {
    return {
      type: NEW_PIPELINE_MODAL_TOGGLE
    }
  }
  
  export function togglePipelineModal() {
    return {
      type: PIPELINE_MODAL_TOGGLE
    }
  }
  
  export function toggleNewScriptModal() {
    return {
      type: NEW_SCRIPT_MODAL_TOGGLE
    }
  }
  
  export function toggleScriptModal() {
    return {
      type: SCRIPT_MODAL_TOGGLE
    }
  }
  
  export function toggleInviteUserModal() {
    return {
      type: INVITE_USER_MODAL_TOGGLE
    }
  }
  
  export function setNewJobName(newJobName) {
    return {
      type: UPDATE_NEW_JOB_NAME,
      newJobName
    }
  }
  export function setJobNameFilter(filter){
    return {
      type: UPDATE_JOB_NAME_FILTER,
      filter
    }
  }
  
  export function setScriptNameFilter(filter){
    return {
      type: UPDATE_SCRIPT_NAME_FILTER,
      filter
    }
  }
  
  export function filterByErrorJobs(filter) {
    return {
      type: SHOW_ERROR_JOBS,
      filter
    }
  }
  
  export function filterByStartedJobs(filter) {
    return {
      type: SHOW_STARTED_JOBS,
      filter
    }
  }
  
  export function filterByQueuedJobs(filter) {
    return {
      type: SHOW_QUEUED_JOBS,
      filter
    }
  }
  
  export function filterByFinishedJobs(filter) {
    return {
      type: SHOW_FINISHED_JOBS,
      filter
    }
  }
  
  export const toggleBuildMode = () => dispatch => {
    dispatch({
      type: TOGGLE_BUILD_MODE,
    });
    return Promise.resolve(true);
  }