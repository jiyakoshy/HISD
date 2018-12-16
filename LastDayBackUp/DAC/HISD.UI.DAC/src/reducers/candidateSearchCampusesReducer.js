import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function candidateSearchCampusesReducer(state = initialState.candidateSearchCampuses, action) {
    switch (action.type) {
        case types.LOAD_CAMPUS_CANDIDATES_BY_EMP_ID_SUCCESS:
            return action.candidateSearchCampuses;
       
        case types.LOAD_CAMPUS_CANDIDATES_BY_EMP_NAME_SUCCESS:
            return action.candidateSearchCampuses;

        default:
            return state;
    }
}