import Cookies from 'js-cookie'

import { 
  showSuccessToast,
  showErrorToast
} from './app_actions';

import {
    loginForJWTToken,
    refreshJWTToken,
    requestUserDetails,
    changePasswordRequest,
    resetPasswordRequest,
    recoverUsernameRequest,
    createNewUser,
    deleteUserRequest,
    changeUserPermissions,
    getUsers
  } from '../Api/api';

/*
* Authorization / User
* Action constants
*/
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAIURE';
export const LOGOUT = 'LOGOUT';
export const RECEIVE_USER = 'RECEIVE_USER';
export const ADD_USER = 'ADD_USER';
export const RECEIVE_USERS = 'RECEIVE_USERS'; 
export const REMOVE_USER = 'REMOVE_USER';
export const CLEAR_USERS = 'CLEAR_USERS';
export const CHANGE_USER_PAGE = 'CHANGE_USER_PAGE';
export const SET_USERS_LOADING = 'SET_USERS_LOADING';
export const SET_USER_NAME_FILTER = 'SET_USER_NAME_FILTER';
export const SET_USER_ROLE_FILTER = 'SET_USER_ROLE_FILTER';

/*
* AUTH
* action creators
*/

export const tryRefresh = () => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {

    try {
      let refreshToken = Cookies.get('refreshToken');
      let results = await refreshJWTToken(refreshToken);
      
      //Refresh success
      if (results.data.hasOwnProperty('access')) {   
        Cookies.set('token', results.data.access);
        return Promise.resolve(true);
      }
      //If we didn't get a new access token, something is wrong. Logout and tell user.
      else{
        
        dispatch({
          type: LOGIN_FAILURE,
          error: results
        })
    
        //remove cookies
        Cookies.remove('token');
        Cookies.remove('refreshToken');
    
        dispatch(showErrorToast("Try logging out and logging in again. Auth credentials are invalid."));
      }
    }

    // On refresh failure, log the user out and show them a message.
    catch (error) {
    
      dispatch({
        type: LOGIN_FAILURE,
        error
      });

      Cookies.remove('token');
      Cookies.remove('refreshToken');

      dispatch(showErrorToast("Try logging out and logging in again. Auth credentials are invalid."));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const tryLogin = (username, password) => async dispatch => {
  try {

    let results = await loginForJWTToken(username, password);

    //Login success
    if (results.data.hasOwnProperty('access') & results.data.hasOwnProperty('refresh')) {
      
      dispatch({
        type: LOGIN_SUCCESS,
        username
      });

      Cookies.set('token', results.data.access);
      Cookies.set('refreshToken', results.data.refresh);

    }
    //Login failure
    else{
      
      dispatch({
        type: LOGIN_FAILURE,
        error: results
      })

      //remove cookies
      Cookies.remove('token');
      Cookies.remove('refreshToken');
    }
    return Promise.resolve(true);
  } 
  catch (error) {
    
    //Remove any JWT tokens from cookies.
    Cookies.remove('token');
    Cookies.remove('refreshToken');

    dispatch(showErrorToast("Error trying to login."));

    dispatch({
      type: LOGIN_FAILURE,
      error
    })
  }
  return Promise.resolve(false);
}

export const getUserDetails = () => async dispatch => {
  try {

    let token = Cookies.get('token');
    let result = await requestUserDetails(token);

    //Login success
    if (result.status===200) {
      
      dispatch({
        type: RECEIVE_USER,
        user: result.data
      });
    
    }
    else{
      
      dispatch({
        type: LOGIN_FAILURE,
        error: result
      })

      //remove cookies
      Cookies.remove('token');
      Cookies.remove('refreshToken');
    }
  } 
  catch (error) {
    
    //Remove any JWT tokens from cookies.
    Cookies.remove('token');
    Cookies.remove('refreshToken');

    dispatch(showErrorToast("Error trying to login."));

    dispatch({
      type: LOGIN_FAILURE,
      error
    })
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
}

export function tryLogout() {
  
  //Remove any JWT tokens from cookies.
  Cookies.remove('token');
  Cookies.remove('refreshToken');

  return {
    type: LOGOUT,
    password: '',
    username: '',
    loggedIn: false,
    token: '',
    refreshToken: ''
  }
}

export const changePassword = (old_password, new_password) => async(dispatch, getState) => {
  console.log("changePassword");
  if (getState().auth.loggedIn) {
    try {
      let token = Cookies.get('token');
      let response = await changePasswordRequest(old_password, new_password, token);
      if (response.status===204) {
        dispatch(showSuccessToast(`Password successfully changed.`));
        return Promise.resolve(true);      
      }
      else {
        dispatch(showErrorToast(`Unable to change password.`));
      }
    } 
    catch (error) {
      dispatch(showErrorToast(`Error trying to change password.`));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const resetPassword = (username) => async(dispatch, getState) => {
  try {
  
    let response = await resetPasswordRequest(username);
    if (response.status===200) {
      dispatch(showSuccessToast(`Please check the e-mail associated with account "${username}"`));
      return Promise.resolve(true);      
    }
    else {
      dispatch(showErrorToast(`Unable to reset password for: ${username}`));
    }
  } 
  catch (error) {
    dispatch(showErrorToast(`Error trying to reset password: ${error.response.data.message}`));
  }
  return Promise.resolve(false);
}

export const recoverUsername = (email) => async (dispatch, getState) => {
  try {
  
    let response = await recoverUsernameRequest(email);
    if (response.status===200) {
      dispatch(showSuccessToast(`Please check your e-mail, ${email}`));
      return Promise.resolve(true);      
    }
    else {
      dispatch(showErrorToast(`Unable to recover username for given email: ${email}`));
    }
  } 
  catch (error) {
    dispatch(showErrorToast(`Error trying to recover username with values: ${error.response.data.message}`));
  }
  return Promise.resolve(false);
}

export const inviteNewUser = (userDetails) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
    
      let token = Cookies.get('token');
      let response = await createNewUser(userDetails, token);
      console.log("Invite new user response: ", response);
      if (response.status===200) {
        dispatch(fetchUsers());
        return Promise.resolve(true);      
      }
      else {
        dispatch(showErrorToast(`Unable to invite user with values: ${userDetails}`));
      }
    } 
    catch (error) {
      dispatch(showErrorToast(`Unable to create this user: ${error.response.data.message}`));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const requestDeleteUserRequest = (userId) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {
    
      let token = Cookies.get('token');
      console.log(`Trying to delete user ID ${userId}`);
      let response = await deleteUserRequest(userId, token);
      console.log("Respose", response);
      if (response.status===204) {
        console.log("Delete success");
        return dispatch(fetchUsers());
      }
      else {
        dispatch(showErrorToast(`Unable to delete user with ID ${userId}`));
      }
    } 
    catch (error) {
      dispatch(showErrorToast(`Error trying to delete user with ID #${userId}`, error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const selectUserPage = (selectedPage) => async (dispatch) => {
  return dispatch({
    type: CHANGE_USER_PAGE,
    selectedPage
  });
};

export const setUserNameFilter = (searchText) => async (dispatch) => {
  return dispatch({
    type: SET_USER_NAME_FILTER,
    searchText
  });
};

export const setUserRoleFilter = (searchRole) => async (dispatch) => {
  return dispatch({
    type: SET_USER_ROLE_FILTER,
    searchRole
  });
};

export const clearUsers = () => async (dispatch) => {
  return dispatch({
    type: CLEAR_USERS,
  });
}

export const receiveUsers = (response) => async (dispatch) => {
  return dispatch({
    type: RECEIVE_USERS,
    response: response,
  });
}

export const requestChangeUserPermissions = (userId, role) => async (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_USERS_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      let response = await changeUserPermissions(userId, role, token);

      if(response.status===200) {
        dispatch({
          type: SET_USERS_LOADING,
          loading: false
        });
        return Promise.resolve(true);
      }
    }    
    catch (error) {
      dispatch(showErrorToast("Error fetching users: " + error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}

export const fetchUsers = () => async (dispatch, getState) => {
  
  if (getState().auth.loggedIn) {
    try {

      dispatch({
        type: SET_USERS_LOADING,
        loading: true
      });

      let token = Cookies.get('token');
      const {selectedPage, searchText, searchRole} = getState().users;

      let response = await getUsers(selectedPage, searchText, searchRole, token);

      if(response.status===200) {
        dispatch(receiveUsers(response.data));
        return Promise.resolve(true);
      }
    }    
    catch (error) {
      dispatch(showErrorToast("Error fetching users: " + error));
    }
  }
  else {
    dispatch(showErrorToast("Not logged in!"));
  }
  return Promise.resolve(false);
}
