import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function candidateNomineesAllCampusReducer(state = initialState.candidateNomineesAllCampus, action) {
    switch (action.type) {
        
        case types.LOAD_CANDIDATE_NOMINEES_ALL_CAMPUS_SUCCESS:
            return action.candidateNomineesAllCampus;
            
        default:
            return state;
    }
}