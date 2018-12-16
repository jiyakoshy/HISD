import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function candidateTypesReducer(state = initialState.candidateTypes, action) {
    switch (action.type) {
        case types.LOAD_CANDIDATE_TYPES_SUCCESS:
            return action.candidateTypes;
        
        default:
            return state;
    }
}