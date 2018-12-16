import * as types from './actionTypes';
import EnrollmentApi from '../api/enrollmentApi';
import AdminApi from '../api/adminApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function loadCalendarsSuccess(calendars) {
    return { type: types.LOAD_CALENDARS_SUCCESS, calendars};
}

export function loadCalendars(schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
            return EnrollmentApi.getCalendarReportDatesByYear(schoolYear).then(calendarsObj => {
                let calendars = calendarsObj.value;
            dispatch(loadCalendarsSuccess(calendars));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateCalendar(calendar) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateReportCalendar(calendar).then(response => {
            dispatch(updateCalendarSuccess(calendar));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateCalendarSuccess(calendar) {
    return { type: types.UPDATE_REPORT_CALENDAR_SUCCESS, calendar };
}

export function clearCalendars() {
    const calendars = [];
    return { type: types.CLEAR_REPORT_CALENDAR_SUCCESS, calendars};
}
