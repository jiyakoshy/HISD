import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function mentorReducer(state = initialState.mentor, action) {
    switch (action.type) {
        case types.LOAD_MENTORPROFILE_BY_EMPLOYEEID_SUCCESS:
            return action.mentor;
        case types.LOAD_MENTORPROFILE_BY_EMPLOYEEIDANDCAMPUSID_SUCCESS:
            return action.mentor;
        // dashboard action
        case types.LOAD_MENTORAGREEMENTACCEPTENCESUMMARY_SUCCESS:
            return action.mentor;
        
        default:
            return state;
    }
}
