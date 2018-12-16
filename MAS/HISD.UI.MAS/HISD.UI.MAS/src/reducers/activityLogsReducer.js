import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityLogReducer(state = initialState.activityLogs, action) {
    switch (action.type) {
        case types.LOAD_ALL_ACTIVITY_LOGS_SUCCESS:
            return action.activityLogs;
        case types.LOAD_ACTIVITY_LOGS_BY_CAMPUSID_SUCCESS:
            return action.activityLogs;
        //case types.LOAD_ACTIVITY_LOGS_BY_MENTEEID_SUCCESS:
        //    return action.activityLogs;
        default:
            return state;
    }
}
