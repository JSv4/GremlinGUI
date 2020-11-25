import axios from 'axios';

let {REACT_APP_PRODUCTION_API_URL, REACT_APP_DEVELOPMENT_API_URL} = process.env;

const API_URL = process.env.NODE_ENV === 'development' ? 
                  REACT_APP_DEVELOPMENT_API_URL :
                  REACT_APP_PRODUCTION_API_URL;

export default axios.create({
    baseURL: `${API_URL}/auth/`,
    timeout: 10000,
  });