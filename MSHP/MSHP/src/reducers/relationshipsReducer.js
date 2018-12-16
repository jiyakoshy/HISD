import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function relationshipsReducer(state = initialState.relationships, action) {
    switch (action.type) {
        case types.LOAD_RELATIONSHIPS_BY_CAMPUSID_SUCCESS:
            return action.relationships;
            
        default:
            return state;
    }
}
