import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function voteEligibilityReducer(state = initialState.voteEligibility, action) {

    switch (action.type) {

        case types.LOAD_VOTE_ELIGIBILITY_NON_CAMPUS_SUCCESS:
            return action.voteEligibility;
        case types.LOAD_VOTE_ELIGIBILITY_CAMPUS_SUCCESS:
            {
               
                return action.voteEligibility;
            }

        default:
            return state;
    }
}