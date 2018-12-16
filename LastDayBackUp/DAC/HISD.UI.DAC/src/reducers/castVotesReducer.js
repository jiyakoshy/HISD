import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function castVotesReducer(state = initialState.castVotes, action) {
    switch (action.type) {
       
        
        case types.CREATE_CAST_VOTES_SUCCESS:
            return action.castVotes;
        default:
            return state;
    }
}