import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function regionTotalsByGradeReducer(state = initialState.regionTotalsByGrade, action) {
    switch (action.type) {
        case types.LOAD_SUMMARY_REPORT_SUCCESS:
            return action.regionTotalsByGrade;
        
        default:
            return state;
    }
}