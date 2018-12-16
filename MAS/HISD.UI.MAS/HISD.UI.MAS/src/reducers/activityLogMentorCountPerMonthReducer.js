import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityLogMentorCountPerMonthReducer(state = initialState.activityLogMentorCountPerMonth, action) {
    switch (action.type) {
        case types.LOAD_ACTIVITY_LOG_MENTOR_COUNT_PER_MONTH_SUCCESS:
            return action.activityLogMentorCountPerMonth;
        default:
            return state;
    }
}
