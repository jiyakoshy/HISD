import * as types from '../actions/actionTypes';
import initialState from './initialState';
import * as actionHelper from '../actions/actionHelper';

export default function activityStandardReducer(state = initialState.activityType, action) {
    switch (action.type) {
        case types.LOAD_ALL_ACTIVITY_TYPE:
            return action.data;
        case types.LOAD_ALL_MENTEE_ACTIVITY_SUCCESS:
            return actionHelper.fetchActivityMenteeDetails(state, action);
        case types.LOAD_ALL_MENTOR_AGREEMENT_SUCCESS:
            return {...state, mentorAgreement : action.data}        
        default:
            return state;
    }
}
