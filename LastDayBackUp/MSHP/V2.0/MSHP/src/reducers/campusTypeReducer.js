import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusTypeReducer(state = initialState.campusType, action) {
    switch (action.type) {
        case types.LOAD_CAMPUSTYPE_BY_CAMPUS_SUCCESS:
            return action.campusType;
        default:
            return state;
    }
}
