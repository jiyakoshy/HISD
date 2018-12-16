import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userSelectedCandidateNomieesReducer(state = initialState.userSelectedCandidateNominees, action) {
    switch (action.type) {
        case types.LOAD_USER_SELECTED_CANDIDATE_NOMINEES_SUCCESS:
            return action.userSelectedCandidateNominees;
        
        default:
            return state;
    }
}