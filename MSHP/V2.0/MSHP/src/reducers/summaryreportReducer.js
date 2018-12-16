import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function summaryreportReducer(state = initialState.summaryreport, action) {
    switch (action.type) {
        case types.LOAD_ALL_SUMMARYREPORTS_SUCCESS:
            return action.summaryreport;
        default:
            return state; 
    }
}
