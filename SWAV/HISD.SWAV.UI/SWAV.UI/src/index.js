/*eslint-disable import/default */
//import 'babel-polyfill';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { HashRouter, hashHistory, Route } from 'react-router-dom';
import App from './components/App';
import { loadUser, loadMenuOptions } from './actions/sharedActions';
import initialState from './reducers/initialState';
import './styles/styles.css';
import LandingPage from './components/home/LandingPage';
import HomePage from './components/home/HomePage';
import ErrorPage from './components/common/ErrorPage';
import SchoolListPage from './components/schoolWaivers/SchoolListPage';
import WaiverDescriptionPage from './components/schoolWaivers/SelectSchoolWaivers/WaiverDescriptionPage';
import SavedWaiverDescriptionPage from './components/schoolWaivers/SelectSchoolWaivers/SavedWaiverDescriptionPage';
import AdministrationPage from './components/application/AdministrationPage';
import GeneralWaiversPage from './components/WaiversAdministration/GeneralWaivers/GeneralWaiversPage';
import LoginPage from './components/login/LoginPage';
import CustomWaiversPage from './components/WaiversAdministration/CustomWaivers/CustomWaiversPage';
import WaiverRequestSchoolsPage from './components/WaiverRequestDetailsForm/WaiverRequestSchoolsPage';
import WaiverRequestDetailsFormPage from './components/WaiverRequestDetailsForm/WaiverRequestDetailsFormPage';
import AddWaiverRequestDetailsForm from './components/WaiverRequestDetailsForm/AddWaiverRequestDetailsForm';

const store = configureStore(initialState);
store.dispatch(loadUser());
render(
    <Provider store={store}>
        <HashRouter hashType="noslash" history={hashHistory}>
            <div>
                <Route path="/" exact component={LandingPage} />
                <Route path="/home" component={HomePage} />
                <Route path="/schools" component={SchoolListPage} />
                <Route path="/waiverDescription/:ID/:campusName" component={WaiverDescriptionPage} />
                <Route path="/SavedWaiverDescription/:ID/:campusName" component={SavedWaiverDescriptionPage} />
                <Route path="/applicationAdmin" component={AdministrationPage}/>
                <Route path="/generalWaivers" component={GeneralWaiversPage}/>
                <Route path="/customWaivers" component={CustomWaiversPage}/>
                <Route path="/waiverRequestForm" component={WaiverRequestSchoolsPage}/>
                <Route path="/addWaiverRequestDetailsForm/:type/:campusNumber/:campusName/:status" component={AddWaiverRequestDetailsForm}/>
                <Route path="/getRequestDetails/:campusNumber/:statusID/:campusName" component={WaiverRequestDetailsFormPage} />
                <Route path="/login" component={LoginPage}/>
                <Route path="/error" component={ErrorPage} />
                <Route path="**" component={App} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
