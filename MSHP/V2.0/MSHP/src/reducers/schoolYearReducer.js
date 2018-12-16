import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function schoolYearReducer(state = initialState.schoolYear, action) {
    switch (action.type) {
        case types.LOAD_CURRENT_SCHOOLYEAR_SUCCESS:
            return action.schoolYear;
        default:
            return state; 
    }
}
