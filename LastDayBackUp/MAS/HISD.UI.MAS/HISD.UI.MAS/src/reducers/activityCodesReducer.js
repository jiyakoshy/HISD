import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityCodesReducer(state = initialState.activityCodes, action) {
    switch (action.type) {
        case types.LOAD_ALL_ACTIVITY_CODES_SUCCESS:
            return action.activityCodes;
        default:
            return state;
    }
}
