import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityLogReducer(state = initialState.activityLog, action) {
    switch (action.type) {
        case types.LOAD_ACTIVITY_LOG_BY_ID_SUCCESS:
            return action.activityLog;
        case types.CREATE_ACTIVITY_LOG_SUCCESS:
            return action.activityLog;
        case types.UPDATE_ACTIVITY_LOG_SUCCESS:
            return action.activityLog;
        case types.DELETE_ACTIVITY_LOG_SUCCESS:
            return {};
        case types.CLEAR_ACTIVITY_LOG_SUCCESS:
            return {};
        
        default:
            return state;
    }
}
