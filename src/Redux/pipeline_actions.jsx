import Cookies from 'js-cookie'

import { 
  showErrorToast,
} from './app_actions';

import {
    uploadPipelineYAML,
    updatePipeline,
    createPipeline,
    getPipelines,
    getPipelineById,
    getFullPipelineById,
    exportPipelineYAML,
    deletePipeline
} from '../Api/api';

import { RECEIVE_PIPELINENODES } from './node_actions';
import { RECEIVE_EDGES } from './edge_actions'; 

/*
* Pipelines
* Action constants
*/

export const ADD_PIPELINE = 'ADD_PIPELINE';
export const RECEIVE_PIPELINES = 'RECIEVE_PIPELINES';
export const RECEIVE_FULL_PIPELINE = 'RECEIVE_FULL_PIPELINE';
export const UPDATE_PIPELINE = 'UPDATE_PIPELINE';
export const REMOVE_PIPELINE = 'REMOVE_PIPELINE';
export const CLEAR_PIPELINES = 'CLEAR_PIPELINES';
export const SELECT_PIPELINE = 'SELECT_PIPELINE';
export const UNSELECT_PIPELINE = 'UNSELECT_PIPELINE';
export const SET_PIPELINES_LOADING = 'SET_PIPELINES_LOADING';
export const CHANGE_PIPELINE_PAGE = 'CHANGE_PIPELINE_PAGE';
export const SET_PIPELINE_SEARCH_STRING = 'SET_PIPELINE_NAME_FILTER';

 /*
 * PIPELINE
 * action creators
 */
 
 export const requestDeletePipeline = (pipelineId) => async (dispatch, getState) => {
   if (getState().auth.loggedIn) {
     try {
       let token = Cookies.get('token');
       let response = await deletePipeline(pipelineId, token);
       if (response.status===204) {
         return Promise.resolve(pipelineId);
       }
     } 
     catch (error) {
       dispatch(showErrorToast(`Error trying to delete pipeline with ID #${pipelineId}: ${error}`));
     }
   }
   else {
     dispatch(showErrorToast("Not logged in!"));
   }
   return Promise.resolve(false);
 }
 
 export const requestDownloadPipelineYAML = (pipelineId) => async (dispatch, getState) => {
   
   if (getState().auth.loggedIn) {
     try {
       let token = Cookies.get('token');
       let response = await exportPipelineYAML(pipelineId, token);
                               
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
       dispatch(showErrorToast(`Error trying to export pipeline ID${pipelineId}: ${error}`));
     }
   }
   else {
     dispatch(showErrorToast("Not logged in!"));
   }
   return Promise.resolve(false);
 }
 
 export const removePipeline = (pipelineId) => dispatch => {
   dispatch({
     type: REMOVE_PIPELINE,
     pipelineId
   });
   return Promise.resolve(true);
 }
 
 export const selectPipelinePage = (selectedPage) => async (dispatch) => {
   return dispatch({
     type: CHANGE_PIPELINE_PAGE,
     selectedPage
   });
 };
 
 export const setPipelineSearchString = (pipelineSearchText) => async (dispatch) => {
   return dispatch({
     type: SET_PIPELINE_SEARCH_STRING,
     pipelineSearchText
   });
 };
 
 export const loadFullPipeline = (id) => async (dispatch, getState) => { 
   console.log("loadFullPipeline");
    if (getState().auth.loggedIn) {
     try {
       let token = Cookies.get('token');
       let response = await getFullPipelineById(id, token);
       console.log("response is: ", response);
       if (response.status===200) {
         dispatch({
           type: UPDATE_PIPELINE,
           updatedPipeline: response.data,
         });
         dispatch({
           type: RECEIVE_PIPELINENODES,
           items: response.data.nodes
         });
         dispatch({
           type: RECEIVE_EDGES,
           items: response.data.edges
         });
         return Promise.resolve(true); 
       }
     }
     catch (error) {
       console.log("Can't load", error);
       dispatch(showErrorToast(`Error loading pipeline #${id}`));
     }
   }
   return Promise.resolve(false);
 }
 
 export const selectPipeline = (selectedPipelineId) => async dispatch => {
    dispatch({
      type: SELECT_PIPELINE,
      selectedPipelineId
    });
   return true
 }
 
 export const updateSinglePipeline = (updatedPipeline) => async dispatch => {
   dispatch({
     type: UPDATE_PIPELINE,
     updatedPipeline
   });
   return true;
 }
 
 export function clearPipelines() {
   return {
     type: CLEAR_PIPELINES,
   }
 }
 
 export function receivePipelines(response) {
   return {
     type: RECEIVE_PIPELINES,
     response,
     receivedAt: Date.now()
   }
 }
 
 export const requestCreatePipeline = (pipelineObj) => async (dispatch, getState) => {
   if (getState().auth.loggedIn) {
     try {
       let token = Cookies.get('token');
       let response = await createPipeline(pipelineObj, token);
       if (response.status===201) {
         dispatch({
           type: ADD_PIPELINE,
           newPipeline: response.data
         });
       }
     } 
     catch (error) {
       dispatch(showErrorToast("Error creating pipeline: "+error));
     }
   }
   else {
     dispatch(showErrorToast("Not logged in!"));
   }
 }
 
 export const fetchPipelines = () => async (dispatch, getState) => {
   
   if (getState().auth.loggedIn) {
     try {
 
       dispatch({
         type: SET_PIPELINES_LOADING,
         loading: true
       });
 
       let token = Cookies.get('token');
       let response = await getPipelines(getState().pipelines.pipelineNameFilter, 
                                         getState().pipelines.selectedPage,
                                         token);
       if (response.status===200) {
         dispatch(receivePipelines(response));
         return Promise.resolve(true);
       }
     } 
     catch (error) {
       dispatch(showErrorToast("Error fetching pipelines: "+error));
       dispatch({
         type: SET_PIPELINES_LOADING,
         loading: false
       })  
     }
   }
   else {
     dispatch(showErrorToast("Not logged in!"));
   }
 
   return Promise.resolve(false);
 
 }
 
 // This is basically the same as requestUpdatePipelineStep except it takes the scaleObj parameters, mergers them 
 // into the selectedDigraph (which I know we can do view data (not nodes and edges)) in anticipating of update. If the network
 // request for the update fails, this is rolled back.
 export const requestScalePipeline = (scaleObj) => async(dispatch, getState) => {
   // todo - do something
 }
 
 // This is basically the same as requestUpdatePipeline except it takes the moveObj parameters, mergers them 
 // into the selectedDigraph (which I know we can do for x, y coords) in anticipating of update. If the network
 // request for the update fails, this is rolled back.
 export const requestMovePipeline = (offsetValues) => async(dispatch, getState) => {
   // todo - do something
 }
 
 export const requestUpdatePipeline = (pipelineObj) => async (dispatch, getState) => {
   
   if (getState().auth.loggedIn) {
     try {
 
       dispatch({
         type: SET_PIPELINES_LOADING,
         loading:true
       });
 
       let token = Cookies.get('token');
       let response = await updatePipeline(pipelineObj, token);
 
       if (response.status===200) {
         dispatch(updateSinglePipeline(pipelineObj));
         return Promise.resolve(true);
       }
     } 
     catch (error) {
       dispatch(showErrorToast("Error updating pipeline: "+error));
     }
   }
   else {
     dispatch(showErrorToast("Not logged in!"));
   }
 
   dispatch({
     type: SET_PIPELINES_LOADING,
     loading: false
   });
 
   return Promise.resolve(false);
 }
 
 export const refreshPipeline = (pipelineId) => async (dispatch, getState) => {
   if (getState().auth.loggedIn) {
     try {
       let token = Cookies.get('token');
       let response = await getPipelineById(pipelineId, token);
       if(response.status===200){
         dispatch(updateSinglePipeline(response.data));
         return Promise.resolve(false);
       }
     } 
     catch (error) {
       dispatch(showErrorToast("Error refreshing pipeline: "+error));
     }
   }
   else {
     dispatch(showErrorToast("Not logged in!"));
   }
   return Promise.resolve(false);
 }
 
 // Try to upload a script archive. NOTE - on success the selected script will be changed to id of new script.
 export const requestUploadPipelineYAML = (file) => async (dispatch, getState) => {
 
   if (getState().auth.loggedIn) {
     try {
       
       dispatch({
         type: SET_PIPELINES_LOADING,
         loading:true
       });
 
       let response = await uploadPipelineYAML(file, Cookies.get('token'));
 
       if (response.status===200) {
         dispatch({
           type: ADD_PIPELINE,
           newPipeline: response.data
         });
         return Promise.resolve(true);
       }
     } 
     catch (error) {
 
       dispatch({
         type: SET_PIPELINES_LOADING,
         loading:false
       });
 
       if (error.response) {
         dispatch(showErrorToast(error.response.data.message));
       } else {
         dispatch(showErrorToast('Something went wrong while uploading this pipeline'));
       }
     }
   }
   return Promise.resolve(false);
 }
 
 
 /*
 * PIPELINE STEP 
 * action creators
 */
 
 export const unselectPipeline = () => dispatch => {
   dispatch({
     type: UNSELECT_PIPELINE
   });
   return Promise.resolve(true);
 }
 