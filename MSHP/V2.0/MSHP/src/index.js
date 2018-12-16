/*eslint-disable import/default */
//import 'babel-polyfill';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { HashRouter, hashHistory, Route } from 'react-router-dom';
import App from './components/App';
import { loadUser, loadMenuOptions, loadCustomUser } from './actions/sharedActions';
import initialState from './reducers/initialState';
import './styles/styles.css';
import LandingPage from './components/home/LandingPage';
import HomePage from './components/home/HomePage';
import ErrorPage from './components/common/ErrorPage';
import LoginPage from './components/login/LoginPage';
import NonReportingSchoolPage from './components/reports/NonReportingSchoolPage';
import EnrollmentHistoryPage from './components/enrollment/EnrollmentHistoryPage';
import EnrollmentInputPage from './components/enrollment/EnrollmentInputPage';
import SummaryReportPage from './components/reports/SummaryReportPage';
import SummaryDetailReportPage from './components/reports/SummaryDetailReportPage';
import DetailReportPage from './components/reports/DetailReportPage';
import AnnualSetupPage from './components/annualsetup/AnnualSetupPage';
import CampusProfilePage from './components/campusprofile/CampusProfilePage';
import CalendarPage from './components/calendar/CalendarPage';

const store = configureStore(initialState);
store.dispatch(loadUser());
render(
    <Provider store={store}>
        <HashRouter hashType="noslash" basename="index.html" history={hashHistory}>
            <div>
                <Route path="/" exact component={LandingPage} />
                <Route path="/home" component={HomePage} />
                <Route path="/error" component={ErrorPage} />
                <Route path="**" component={App} />
                <Route path="/login" component={LoginPage} />
                <Route path="/nonreportingschool" component={NonReportingSchoolPage} /> 
                <Route path="/enrollmenthistory" component={EnrollmentHistoryPage} /> 
                <Route path="/enrollmentinput" component={EnrollmentInputPage}/>
                <Route path="/campusprofile" component={CampusProfilePage}/>
                <Route path="/summaryreport" component={SummaryReportPage} /> 
                <Route path="/summarydetailreport" component={SummaryDetailReportPage} /> 
                <Route path="/detailreport" component={DetailReportPage} /> 
                <Route path="/annualsetup" component={AnnualSetupPage} /> 
                <Route path="/calendar" component={CalendarPage} /> 
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
