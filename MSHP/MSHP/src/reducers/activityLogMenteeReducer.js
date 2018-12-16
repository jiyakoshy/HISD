import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityLogMenteeReducer(state = initialState.activityLogMentee, action) {
    switch (action.type) {
        case types.LOAD_ACTIVITY_LOG_MENTEE_BY_ID_SUCCESS:
            return action.activityLogMentee;
        case types.UPDATE_ACTIVITY_LOG_MENTEE_SUCCESS:
            return action.activityLogMentee;
        
        default:
            return state;
    }
}
