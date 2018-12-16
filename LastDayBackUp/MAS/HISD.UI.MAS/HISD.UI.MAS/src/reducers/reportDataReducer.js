import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function reportDataReducer(state = initialState.reportData, action) {
    switch (action.type) {
        case types.LOAD_DEMOGRAPHIC_REPORT_SUCCESS:
            return action.reportData;
        case types.LOAD_MENTOR_ACTIVITY_LOG_REPORT_SUCCESS:
            return action.reportData;
        case types.LOAD_ACTIVITY_TOTAL_REPORT_SUCCESS:
            return action.reportData;
        case types.LOAD_ACTIVITY_LOG_VERIFICATION_REPORT_SUCCESS:
            return action.reportData;
        case types.CLEAR_REPORT_DATA_SUCCESS:
            return [];
        default:
            return state;
    }
}
