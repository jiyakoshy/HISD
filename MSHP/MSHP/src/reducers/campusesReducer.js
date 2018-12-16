import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusesReducer(state = initialState.campuses, action) {
    switch (action.type) {
        case types.LOAD_ALL_CAMPUSES_SUCCESS:
            return action.campuses;
        case types.LOAD_CAMPUSES_BY_MANAGER_SUCCESS:
            return action.campuses;
        case types.CLEAR_CAMPUSES_SUCCESS:
            return [];
        default:
            return state;
    }
}
