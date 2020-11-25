import Cookies from 'js-cookie'

import { 
  showErrorToast,
} from './app_actions';

import {
    requestCreatePipelineEdge,
    requestDeletePipelineEdge,
  } from '../Api/api';

/*
* Edge
* Action constants
*/
export const SELECT_EDGE = 'SELECT_EDGE';
export const UNSELECT_EDGE = 'UNSELECT_EDGE';
export const ADD_EDGE = 'ADD_EDGE';
export const RECEIVE_EDGES = 'RECEIVE_EDGES'; 
export const UPDATE_EDGE = 'UPDATE_EDGE';
export const REMOVE_EDGE = 'REMOVE_EDGE';
export const CLEAR_EDGES = 'CLEAR_EDGE';
export const SET_EDGES_LOADING = 'SET_EDGES_LOADING';


export const removeEdge = (edgeId) => dispatch => {
  console.log("Deleted edge: ",edgeId);
  dispatch({
    type: REMOVE_EDGE,
    edgeId
  });
  return Promise.resolve(true);
}

export const addEdge = (edge) => dispatch => {
  dispatch({
    type: ADD_EDGE,
    edge
  });
  return Promise.resolve(true);
}

export const createPipelineEdge = (edgeObj) => async (dispatch, getState) => {
    console.log("createPipelineEdge", edgeObj);
    if (getState().auth.loggedIn) {
      try {
        let token = Cookies.get('token');
        let response = await requestCreatePipelineEdge (edgeObj, token);

        if (response.status===201) {
          dispatch(addEdge(response.data));
          return Promise.resolve(response.data);
        }
      }
      catch (error) {
        dispatch(showErrorToast("Error linking nodes: "+error));
      }
    }
    return Promise.resolve(false);
  }
  
  export const deletePipelineEdge = (edgeId) => async (dispatch, getState) => {
    if (getState().auth.loggedIn) {
      try {
        let token = Cookies.get('token');
        let response = await requestDeletePipelineEdge(edgeId, token);
        console.log("Response:", response);
        if (response.status===204) {
          console.log("Deleted!");
          dispatch({
            type: REMOVE_EDGE,
            edgeId
          });
        }
        else {
          console.log("Not deleted");
        }
      }
      catch (error) {
        dispatch(showErrorToast("Error deleting link: "+error));
      }
  }
    return Promise.resolve(false);
  }