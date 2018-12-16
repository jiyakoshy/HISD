import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function summarydetailreportReducer(state = initialState.summarydetailreport, action) {
    switch (action.type) {
        case types.LOAD_ALL_SUMMARYDETAILREPORTS_SUCCESS:
            return action.summarydetailreport;
        default:
            return state; 
    }
}
