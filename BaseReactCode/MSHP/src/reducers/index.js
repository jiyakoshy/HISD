import {combineReducers} from 'redux';
import userProps from './userReducer';
import menuOptions from './menuOptionsReducer';
import appProps from './appReducer';
import campuses from './campusesReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import errorMsg from './errorReducer';

const rootReducer = combineReducers({
    userProps, menuOptions, appProps, campuses, errorMsg, ajaxCallsInProgress
});

export default rootReducer;
