import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function menteesEndDateReducer(state = initialState.menteeEndDate, action) {
    switch (action.type) {
        case types.LOAD_MENTEE_ENDDATE_BY_EMPLOYEEID_SUCCESS:
            return action.menteeEndDate;
        case types.UPDATE_MENTEE_ENDDATE_SUCCESS:
            return { ...state, MenteeEndDate: action.menteeEndDate.MenteeEndDate};
        case types.DELETE_MENTEE_ENDDATE_SUCCESS:
            return {};

        default:
            return state;
    }
}
