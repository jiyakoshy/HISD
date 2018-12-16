import * as types from './actionTypes';
import EnrollmentApi from '../api/enrollmentApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function loadCalendarReportDatesSuccess(calendarReportDates) {
    return { type: types.LOAD_CALENDAR_REPORT_DATES_SUCCESS, calendarReportDates};
}

export function loadCalendarReportDates(schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
            return EnrollmentApi.getCalendarReportDates().then(calendarReportDatesObj => {
                let reportDates = calendarReportDatesObj.value;
            dispatch(loadCalendarReportDatesSuccess(reportDates));
        }).catch(error => {
            throw (error);
        });
    };
}

