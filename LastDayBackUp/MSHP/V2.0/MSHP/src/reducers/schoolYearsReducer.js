import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function schoolYearsReducer(state = initialState.schoolYears, action) {
    switch (action.type) {
        case types.LOAD_ALL_SCHOOLYEARS_SUCCESS:
            return action.schoolYears;
        default:
            return state; 
    }
}
