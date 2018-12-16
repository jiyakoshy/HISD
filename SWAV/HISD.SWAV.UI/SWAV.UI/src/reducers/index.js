import {combineReducers} from 'redux';
import userProps from './userReducer';
import menuOptions from './menuOptionsReducer';
import appProps from './appReducer';
import campuses from './campusesReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import errorMsg from './errorReducer';
import waiversReducer from './waiversReducer';
import applicationAdminReducer from './applicationAdminReducer';
import generalWaivers from './generalWaiverReducer';
import waiverRequestReducer from './waiverRequestReducer';
import {reducer as notifications} from 'react-notification-system-redux';

const rootReducer = combineReducers({
    userProps,
    menuOptions,
    appProps,
    campuses,
    errorMsg,
    ajaxCallsInProgress,
    waiversReducer,
    applicationAdminReducer,
    generalWaivers,
    notifications,
    waiverRequestReducer
});

export default rootReducer;
