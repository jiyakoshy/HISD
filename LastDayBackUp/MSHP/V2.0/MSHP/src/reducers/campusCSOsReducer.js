import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusCSOsReducer(state = initialState.campusCSOs, action) {
    switch (action.type) {
        case types.LOAD_ALL_CSOS_SUCCESS:
            return action.campusCSOs;
        case types.LOAD_CSO_CAMPUS_SUCCESS:
            return action.campusCSOs;
        default:
            return state;
    }
}
