import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityLogReducer(state = initialState.activityLogsMentee, action) {
    switch (action.type) {
        case types.LOAD_ACTIVITY_LOGS_BY_MENTEEID_SUCCESS:
            return action.activityLogsMentee;
        default:
            return state;
    }
}
