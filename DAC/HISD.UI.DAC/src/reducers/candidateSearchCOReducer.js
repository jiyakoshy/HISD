import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function candidateSearchCOReducer(state = initialState.candidateSearchCO, action) {
    switch (action.type) {
        case types.LOAD_CANDIDATES_BY_EMP_ID_SUCCESS:
            return action.candidateSearchCO;
        case types.LOAD_CANDIDATE_BY_DEPARTMENT_ID_SUCCESS:
            return action.candidateSearchCO;
        case types.LOAD_CANDIDATES_BY_EMP_NAME_SUCCESS:
            return action.candidateSearchCO;

        default:
            return state;
    }
}
