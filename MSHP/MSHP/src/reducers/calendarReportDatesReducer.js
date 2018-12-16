import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function calendarReportDatesReducer(state = initialState.calendarReportDates, action) {
    switch (action.type) {
        case types.LOAD_CALENDAR_REPORT_DATES_SUCCESS:
            return action.calendarReportDates;
        default:
            return state;
    }
}
