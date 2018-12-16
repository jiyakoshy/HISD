import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function mentorActivityLogReducer(state = initialState.mentorActivityLog, action) {
    switch (action.type) {
        case types.CREATE_MENTOR_ACTIVITY_LOG_SUCCESS:
            return action.mentorActivityLog;
        default:
            return state;
    }
}
