import Cookies from 'js-cookie'

import { 
  showErrorToast,
} from './app_actions';

import {
    getPipelineSteps,
    getPipelineStepsForPipeline,
    updatePipelineStep,
    getPipelineStepById,
    createPipelineStep,
    deletePipelineStep,
} from '../Api/api';

/*
* Pipeline Steps
* Action constants
*/
export const ADD_PIPELINENODE = 'ADD_PIPELINENODE';
export const RECEIVE_PIPELINENODES = 'RECIEVE_PIPELINENODES';
export const UPDATE_PIPELINENODE = 'UPDATE_PIPELINENODE';
export const REMOVE_PIPELINENODE = 'REMOVE_PIPELINENODE';
export const CLEAR_PIPELINENODES = 'CLEAR_PIPELINENODES';
export const SELECT_PIPELINENODE = 'SELECT_PIPELINENODE';
export const CLEAR_SELECTED_PIPELINENODE = 'CLEAR_SELECTED_PIPELINENODE';
export const SET_PIPELINENODES_LOADING = 'SET_PIPELINENODES_LOADING';


export const selectPipelineStep = (selectedPipelineStepId) => dispatch => {
    dispatch({
        type: SELECT_PIPELINENODE,
        selectedPipelineStepId
    });
    return Promise.resolve(true);
}
  
export const clearSelectedPipelineNode = () => dispatch => {
    dispatch({
        type: CLEAR_SELECTED_PIPELINENODE
    });
    return Promise.resolve(true);
}

export function clearPipelineStep() {
    return {
        type: CLEAR_PIPELINENODES,
    }
}

export function receivePipelineSteps(response) {
    return {
        type: RECEIVE_PIPELINENODES,
        response,
    }
}

export function removePipelineStep(pipelineStepId) {
    return {
        type: REMOVE_PIPELINENODE,
        pipelineStepId: pipelineStepId
    }
}

export const addPipelineNode = (node) => async (dispatch) => {
    console.log("addPipelineNode");
    await dispatch({
        type: ADD_PIPELINENODE,
        newPipelineStep: node,
    });
    return node;
}

export const requestAddPipelineNode = (name, script, step_settings) => async (dispatch, getState) => {
    console.log("requestAddPipelineNode", name, script, step_settings)
    if (getState().auth.loggedIn) {
        try {
            let token = Cookies.get('token');
            let response = await createPipelineStep({name, script, parent_pipeline: getState().pipelines.selectedPipelineId, step_settings: JSON.stringify(step_settings)}, token);
            console.log("requestAddPipelineNode response:", response);
            if (response.status === 201) {
                console.log("Success");
                let data = await dispatch(addPipelineNode(response.data));
                console.log("Successfully added addPipelineNode and response is", data);
                return data;
            }
        }
        catch (error) {
            dispatch(showErrorToast("Error adding node to pipeline: "+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }
    return false;
}

//TODO - this is duplicative with above and neither isreally multipurpose. Replace with a single method that accepts object.
export const createNewPipelineStep = (name, scriptId, pipelineId, step_settings, step_number) => async (dispatch, getState) => {
    if (getState().auth.loggedIn) {
        try {

        let token = Cookies.get('token');
        let response = await createPipelineStep({name, script: scriptId, parent_pipeline: pipelineId, step_settings: JSON.stringify(step_settings), step_number}, token);

        if (response.status === 201) {
            dispatch(fetchPipelineSteps()); //can't just add the step because other pipeline steps may have been changed. Need to refetch.
        }
        } 
        catch (error) {
        dispatch(showErrorToast("Error creating new pipeline step: "+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }
    return Promise.resolve();
}

export const requestDeletePipelineStep = (pipelineStepId) => async (dispatch, getState) => {
    if (getState().auth.loggedIn) {
        try {
        let token = Cookies.get('token');
        let deleteResponse = await deletePipelineStep(pipelineStepId, token);
        if (deleteResponse.status===204) {
            dispatch(removePipelineStep(pipelineStepId));
            return Promise.resolve();
        }
        } 
        catch (error) {
        dispatch(showErrorToast("Error deleting pipeline step: "+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }

    return Promise.resolve();
}

export const fetchPipelineStepsForPipeline = (targetPipelineId) => async(dispatch, getState) => {
    if (getState().auth.loggedIn) {
        try {

        dispatch({
            type: SET_PIPELINENODES_LOADING,
            loading:true
        })

        let token = Cookies.get('token');
        let response = await getPipelineStepsForPipeline(targetPipelineId, token);
        if (response.status===200) {
            dispatch(receivePipelineSteps(response));
        }
        return Promise.resolve(true);

        } 
        catch (error) { 
        dispatch(showErrorToast("Error fetching pipeline steps: "+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }
    return Promise.resolve(false);
}


export const fetchPipelineSteps = () => async (dispatch, getState) => {

    if (getState().auth.loggedIn) {
        try {

        dispatch({
            type: SET_PIPELINENODES_LOADING,
            loading:true
        })

        let token = Cookies.get('token');
        let response = await getPipelineSteps(token);
        if (response.status===200) {
            dispatch(receivePipelineSteps(response));
        }
        return Promise.resolve(true);

        } 
        catch (error) { 
        dispatch(showErrorToast("Error fetching pipeline steps: "+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }
    return Promise.resolve(false);
}

export function handleUpdatePipelineStep(updatedPipelineStep){
    return {
        type: UPDATE_PIPELINENODE,
        updatedPipelineStep
    }
}

export const requestRefreshPipelineStep = (pipelineStepId) => async (dispatch, getState) => {
    if (getState().auth.loggedIn) {
        try {
        let token = Cookies.get('token');
        let response = await getPipelineStepById(pipelineStepId, token);
        if (response.status===200) {
            dispatch(handleUpdatePipelineStep(response.data));      
        }
        } 
        catch (error) { 
        dispatch(showErrorToast(`Error trying to refresh pipeline step with ID #${pipelineStepId}: `+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }
}

export function refreshSelectedPipelineStep() {
    return (dispatch, getState) => {
        dispatch(requestRefreshPipelineStep(getState().pipelinesteps.selectedPipelineStepId));
    }
}

//Pass the serialized settings for a job to the server. 
export const requestUpdatePipelineStep = (pipelineStepObj) => async (dispatch, getState) => {
    if (getState().auth.loggedIn) {
        try {
            let token = Cookies.get('token');
            let response = await updatePipelineStep(pipelineStepObj, token);

            console.log("Pipeline step updated: ", response.data);

            if (response.status===200) {
                dispatch(handleUpdatePipelineStep(response.data));
                return Promise.resolve(true);  
            }
            
        } 
        catch (error) {
        dispatch(showErrorToast(`Error trying to update settings for pipelinestep with ID #${pipelineStepObj.id}: `+error));
        }
    }
    else {
        dispatch(showErrorToast("Not logged in!"));
    }
    return Promise.resolve(false);
}
