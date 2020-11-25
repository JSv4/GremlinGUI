import Cookies from 'js-cookie';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

let {REACT_APP_PRODUCTION_API_URL, REACT_APP_DEVELOPMENT_API_URL} = process.env;

const API_URL = process.env.NODE_ENV === 'development' ? 
                  REACT_APP_DEVELOPMENT_API_URL :
                  REACT_APP_PRODUCTION_API_URL;

// Nice tutorial on setting up a custom axios instance and adding in interceptors
// https://www.techynovice.com/setting-up-JWT-token-refresh-mechanism-with-axios/
// Ended up finding it easier to use axios-auth-refresh as it packages up relevant logic.
const dataAxios = axios.create({
  baseURL: `${API_URL}/api/`,
  timeout: 10000,
});
 
// Function that will be called to refresh authorization
const refreshAuthLogic = failedRequest => axios.post(`${API_URL}/auth/token/refresh/`, {
  refresh: Cookies.get("refreshToken")
}).then(tokenRefreshResponse => {
  console.log("FailedRequest", failedRequest);
  console.log("Trigger Refresh", tokenRefreshResponse);  
  Cookies.set('token', tokenRefreshResponse.data.access);
  failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access;
  return Promise.resolve();
});
 
// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(dataAxios, refreshAuthLogic);

export default dataAxios;