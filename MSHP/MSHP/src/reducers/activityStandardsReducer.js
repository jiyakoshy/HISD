import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityStandardsReducer(state = initialState.activityStandards, action) {
    switch (action.type) {
        case types.LOAD_ALL_ACTIVITY_STANDARDS_SUCCESS:
            return action.activityStandards;

        default:
            return state;
    }
}
