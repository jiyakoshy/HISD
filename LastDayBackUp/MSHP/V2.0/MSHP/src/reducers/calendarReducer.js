import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function calendarReducer(state = initialState.calendar, action) {
    switch (action.type) {
        case types.UPDATE_REPORT_CALENDAR_SUCCESS:
            return action.calendar;
        default:
            return state;
    }
}
