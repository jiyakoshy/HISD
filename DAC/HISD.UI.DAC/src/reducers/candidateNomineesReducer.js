import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function candidateNomineesReducer(state = initialState.candidateNominees, action) {
    switch (action.type) {

        case types.CREATE_CANDIDATE_NOMINEES_CENTRAL_OFFICE_SUCCESS:
            return action.candidateNominees;
        case types.DELETE_CANDIATE_NOMINEE_SUCCESS:
            return {};
        case types.LOAD_CANDIDATE_NOMINEES_USING_CAMPUS_ID_SUCCESS:
            return action.candidateNominees;
        case types.LOAD_CANDIDATE_NOMINEES_BASED_ON_LOCATION_SUCCESS:
            return action.candidateNominees;
            
        default:
            return state;
    }
}