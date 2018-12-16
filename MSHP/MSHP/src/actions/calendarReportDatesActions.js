import * as types from './actionTypes';
import MshpApi from '../api/mshpApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function loadCalendarReportDatesSuccess(calendarReportDates) {
    return { type: types.LOAD_CALENDAR_REPORT_DATES_SUCCESS, calendarReportDates};
}

export function loadCalendarReportDates(schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
       
        //return MshpApi.getCalendarReportDatesByYear(schoolYear).then(calendarReportDatesObj => {
            return MshpApi.getCalendarReportDates().then(calendarReportDatesObj => {
                let reportDates = calendarReportDatesObj.value;
                
            /* let today = new Date();
            
            let reportDates = [];
            $.each (calendarReportDatesObj.value, function (key, obj) {
                 let newReportDate = {} ;
                 if (obj.ReportDate !== null) {
                    const checkDate = obj.ReportDate;
                   
                    if (today > checkDate) {
                        if (obj.CompareDaySeq > 0) {
                            newReportDate.compareDaySeq = obj.CompareDaySeq.toString();
                            newReportDate.reportDate = obj.ReportDate;
                            newReportDate.calendarID = obj.CalendarID;
                            newReportDate.schoolYear = obj.SchoolYear;
                            newReportDate.instructionDay = obj.InstructionDay;
                         }
                    }
                     
                    
                 } 
                 reportDates.push(newReportDate);
                }); */
            dispatch(loadCalendarReportDatesSuccess(reportDates));
        }).catch(error => {
            throw (error);
        });
    };
}

