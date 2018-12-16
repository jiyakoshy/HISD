import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityStandardsReducer(state = initialState.activityStandards, action) {
    switch (action.type) {
        case types.LOAD_ALL_ACTIVITY_STANDARDS_SUCCESS:
            return action.activityStandards;
        case types.CREATE_ACTIVITY_STANDARD_SUCCESS:
            return action.activityStandards;
        case types.UPDATE_ACTIVITY_TYPE_SUCCESS:
            return action.activityStandards;
        default:
            return state;
    }
}
