import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function calendarsReducer(state = initialState.calendars, action) {
    switch (action.type) {
        case types.LOAD_CALENDARS_SUCCESS:
            return action.calendars;
        case types.CLEAR_REPORT_CALENDAR_SUCCESS:
            return [];
        default:
            return state;
    }
}
