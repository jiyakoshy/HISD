import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function enrollmentsReducer(state = initialState.enrollments, action) {
    switch (action.type) {
        case types.LOAD_ENROLLMENTS_BY_CAMPUS_SUCCESS:
            return action.enrollments;
        case types.CLEAR_ENROLLMENTS_DATA_SUCCESS:
            return [];
        default:
            return state;
    }
}
