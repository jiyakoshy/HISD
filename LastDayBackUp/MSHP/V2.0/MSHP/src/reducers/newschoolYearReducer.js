import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function newschoolYearReducer(state = initialState.newschoolYear, action) {
    switch (action.type) {
        case types.LOAD_SCHOOLYEAR_TYPE_SUCCESS:
            return action.newschoolYear;
        default:
            return state; 
    }
}
