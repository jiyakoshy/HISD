import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function mentorReducer(state = initialState.mentee, action) {
    switch (action.type) {
        case types.LOAD_MENTEERELATIONSHIPPROFILE_BY_EMPLOYEEID_SUCCESS:
            return action.mentee;
        case types.LOAD_ALREADY_ADDED_MENTEES_BY_CAMPUS_SUCCESS:
            return {...state, alreadyExistMentees : action.mentees} 
        default:
            return state;
    }
}
