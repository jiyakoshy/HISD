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
import AdminHomePage from './components/home/AdminHomePage';
import PrincipalHomePage from './components/home/PrincipalHomePage';
import MentorsPage from './components/mentors/MentorsPage';
import MenteesPage from './components/mentees/MenteesPage';
import RelationshipsPage from './components/relationships/RelationshipsPage';
import NewRelationshipPage from './components/relationships/NewRelationshipPage';
import ViewRelationshipPage from './components/relationships/ViewRelationshipPage';
import ActivityLogsPage from './components/activitylogs/ActivityLogsPage';
import NewActivityLogPage from './components/activitylogs/NewActivityLogPage';
import EditActivityLogPage from './components/activitylogs/EditActivityLogPage';
import ActivityLogsMenteePage from './components/activitylogs/ActivityLogsMenteePage';
import MenteeVerificationPage from './components/activitylogs/MenteeVerificationPage';
import ReportsPage from './components/reports/ReportsPage';
import ActivityTotalReportPage from './components/reports/ActivityTotalReportPage';
import DemographicReportPage from './components/reports/DemographicReportPage';
import MentorActivityLogReportPage from './components/reports/MentorActivityLogReportPage';
import MentorCompletionReportPage from './components/reports/MentorCompletionReportPage';
import VerificationReportPage from './components/reports/VerificationReportPage';
import AdminPage from './components/admin/AdminPage';
import TimeConfigPage from './components/admin/TimeConfigPage';
import NewTimeConfigPage from './components/admin/NewTimeConfigPage';
import EditTimeConfigPage from './components/admin/EditTimeConfigPage';
import ActivityCodesPage from './components/admin/ActivityCodesPage';
import NewActivityCodePage from './components/admin/NewActivityCodePage';
import EditActivityCodePage from './components/admin/EditActivityCodePage';
import MentorAgreementPage from './components/admin/MentorAgreementPage';
import CBMStandardsPage from './components/admin/CBMStandardsPage';
import EditCBMStandardPage from './components/admin/EditCBMStandardPage';
import HomeMessagesPage from './components/admin/HomeMessagesPage';
import NewHomeMessagePage from './components/admin/NewHomeMessagePage';
import EditHomeMessagePage from './components/admin/EditHomeMessagePage';
import SiteContentPage from './components/admin/SiteContentPage';
import NewSiteContentPage from './components/admin/NewSiteContentPage';
import EditSiteContentPage from './components/admin/EditSiteContentPage';
import MenteesEndDatesPage from './components/admin/MenteesEndDatesPage';
import EditMenteeEndDatePage from './components/admin/EditMenteeEndDatePage';
import VerificationCodesPage from './components/admin/VerificationCodesPage';
import NewVerificationCodePage from './components/admin/NewVerificationCodePage';
import EditVerificationCodePage from './components/admin/EditVerificationCodePage';
import CampusContactsPage from './components/admin/CampusContactsPage';
import NewCampusContactPage from './components/admin/NewCampusContactPage';
import EditCampusContactPage from './components/admin/EditCampusContactPage';
import ErrorPage from './components/common/ErrorPage';
import EnrollmentInputPage from './components/enrollment/EnrollmentInputPage';
import EditEnrollmentInputPage from './components/enrollment/EditEnrollmentInputPage';

import EnrollmentHistoryPage from './components/enrollment/EnrollmentHistoryPage';
import CampusProfilePage from './components/enrollment/CampusProfilePage';
import LoginPage from './components/login/LoginPage';

const store = configureStore(initialState);
store.dispatch(loadUser());//loadUser()
render(
    <Provider store={store}>
        <HashRouter hashType="noslash" basename="index.html" history={hashHistory}>
            <div>
            <Route path="/" exact component={LandingPage} />
            <Route path="/home" component={HomePage} />
            <Route path="/adminhome" component={AdminHomePage} />//gm should be AdminHomepage
            <Route path="/principalhome" component={PrincipalHomePage} />
            <Route path="/enrollmentinput" component={EnrollmentInputPage}/>
            <Route path="/editenrollmentinput/:CampusEnrollmentID" component={EditEnrollmentInputPage}/>
            <Route path="/campusprofile" component={CampusProfilePage}/>
            <Route path="/enrollmentHistory" component={EnrollmentHistoryPage} />
            <Route path="/login" component={LoginPage} />


            <Route path="/mentors" component={MentorsPage} />
                <Route path="/mentees" component={MenteesPage} />
                <Route path="/relationships" exact component={RelationshipsPage} />
                <Route path="/newrelationship" component={NewRelationshipPage} />
                <Route path="/relationships/:MentorMenteeRelationshipID" component={ViewRelationshipPage} />
                <Route path="/campuscontacts" component={CampusContactsPage} />
                <Route path="/menteesenddates" component={MenteesEndDatesPage} />
                <Route path="/newcampuscontact" component={NewCampusContactPage} />
                <Route path="/admin" exact component={AdminPage} />
                <Route path="/admin-timeconfig" exact component={TimeConfigPage} />
                <Route path="/admin-timeconfig/:TimeConfigurationID" component={EditTimeConfigPage} />
                <Route path="/admin-newtimeconfig" component={NewTimeConfigPage} />
                <Route path="/admin-activitycodes" component={ActivityCodesPage} />
                <Route path="/admin-newactivitycode" component={NewActivityCodePage} />
                <Route path="/admin-activitycode/:ActivityCodeID" component={EditActivityCodePage} />
                <Route path="/admin-homemessages" component={HomeMessagesPage} />
                <Route path="/admin-newhomemessage" component={NewHomeMessagePage} />
                <Route path="/admin-homemessage/:HomeMessageID" component={EditHomeMessagePage} />
                <Route path="/admin-sitecontent" exact component={SiteContentPage} />
                <Route path="/admin-newsitecontent" component={NewSiteContentPage} />
                <Route path="/admin-sitecontent/:SiteContentID" component={EditSiteContentPage} />
                <Route path="/admin-cbmstandards" component={CBMStandardsPage} />
                <Route path="/admin-cbmstandard/:CBMStandardID" component={EditCBMStandardPage} />
                <Route path="/admin-campuscontacts" exact component={CampusContactsPage} />
                <Route path="/admin-newcampuscontact" component={NewCampusContactPage} />
                <Route path="/admin-campuscontacts/:StaffNaturalKey/:EducationOrgNaturalKey" component={EditCampusContactPage} />
                <Route path="/admin-menteesenddates" exact component={MenteesEndDatesPage} />
                <Route path="/admin-menteesenddates/:StaffNaturalKey" component={EditMenteeEndDatePage} />
                <Route path="/admin-verificationcodes" component={VerificationCodesPage} />
                <Route path="/admin-newverificationcode" component={NewVerificationCodePage} />
                <Route path="/admin-verificationcode/:MultiChoiceListItemID" component={EditVerificationCodePage} />
                <Route path="/reports" exact component={ReportsPage} />
                <Route path="/reports-activitytotal" exact component={ActivityTotalReportPage} />
                <Route path="/reports-demographic" component={DemographicReportPage} />
                <Route path="/reports-mentorlogs" component={MentorActivityLogReportPage} />
                <Route path="/reports-mentorcompletion" component={MentorCompletionReportPage} />
                <Route path="/reports-verification" component={VerificationReportPage} />
                <Route path="/activitylogs" exact component={ActivityLogsPage} />
                <Route path="/activitylogsmentee" exact component={ActivityLogsMenteePage} />
                <Route path="/newactivitylogentry" component={NewActivityLogPage} />} />
                <Route path="/activitylogs/:ActivityLogID" component={EditActivityLogPage} />
                <Route path="/menteeverification/:ActivityLogID/:ActivityLogMenteeID" component={MenteeVerificationPage} />
                <Route path="/error" component={ErrorPage} />
                <Route path="**" component={App} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
