import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-less/semantic.less';

import 'babel-polyfill';
import { Provider } from 'react-redux';
import configureStore from './Redux/configureStore';
import { ToastContainer } from 'react-toastify';
import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter,
    Switch,
    Route 
} from "react-router-dom";
import AsyncApp from './Containers/AsyncApp';
import LawyerHome from './Containers/LawyerHome';
import RoleProtectedRoute from './Routes/RoleProtectedRoute';
import Login from './Containers/Login';
import DigraphEngine from './DigraphEngine/DigraphEngine';


const store = configureStore();
const digraphEngine = new DigraphEngine(store);

const homeOptions = {
    "ADMIN": AsyncApp,
    "LEGAL_ENG": AsyncApp,
    "LAWYER": LawyerHome
};

console.log("Index.js");

render((
    <Provider store={store}>
        <ToastContainer/>
        <BrowserRouter>
            <Switch>
                <Route key={0} path="/login" component={Login}/>
                <RoleProtectedRoute key={1} exact={true} digraphEngine={digraphEngine} path="/" componentOptions={homeOptions}/>
                <RoleProtectedRoute key={1} exact={true} digraphEngine={digraphEngine} path="/home" componentOptions={homeOptions}/>
            </Switch>
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));
