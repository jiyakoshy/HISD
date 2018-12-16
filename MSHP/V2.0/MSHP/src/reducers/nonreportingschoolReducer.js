import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function nonreportingschoolReducer(state = initialState.nonreportingschool, action) {
    switch (action.type) {
        case types.LOAD_ALL_NONSCHOOLREPORTS_SUCCESS:
            return action.nonreportingschool;
        default:
            return state; 
    }
}
