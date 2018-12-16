import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function reportDatesReducer(state = initialState.reportDates, action) {
    switch (action.type) {
        case types.LOAD_ALL_COMPAREDAYSEQS_SUCCESS:
            return action.reportDates;
        default:
            return state; 
    }
}
