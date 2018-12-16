import * as types from './actionTypes';
import ReportsApi from '../api/reportsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadDemographicReportSuccess(reportData) {
    return { type: types.LOAD_DEMOGRAPHIC_REPORT_SUCCESS, reportData};
}

export function loadDemographicReport(params) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ReportsApi.getDemographicReport(params).then(reportDataObj => {
            let reportData = [];
            $.each(reportDataObj.value, function (key,obj) {
                obj.MentorName = obj.MentorFirstName + " " + obj.MentorMentorLastSurname;
                obj.MenteeName = obj.MenteeFirstName + " " + obj.MenteeMentorLastSurname;
                obj.CICName = obj.CreatedByFirstName + " " + obj.CreatedByLastSurName;
                obj.CICEmployeeID = obj.CreatedByEmployeeID;
                obj.CICElectronicMailAddress = obj.CreatedByElectronicMailAddress;
                reportData.push(obj);
            });
            dispatch(loadDemographicReportSuccess(reportData));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadMentorActivityLogReportSuccess(reportData) {
    return { type: types.LOAD_MENTOR_ACTIVITY_LOG_REPORT_SUCCESS, reportData};
}

export function loadMentorActivityLogReport(params) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ReportsApi.getMentorActivityLogReport(params).then(reportDataObj => {
            let reportData = [];
            $.each(reportDataObj.value, function (key,obj) {
                obj.MentorName = obj.MentorFirstName + " " + obj.MentorLastSurname;
                obj.MenteeName = obj.MenteeFirstName + " " + obj.MenteeLastSurname;
                obj.CICName = obj.CreatedByFirstName + " " + obj.CreatedByLastSurName;
                obj.CICEmployeeID = obj.CreatedByEmployeeID;
                obj.CICElectronicMailAddress = obj.CreatedByElectronicMailAddress;
                reportData.push(obj);
            });
            dispatch(loadMentorActivityLogReportSuccess(reportData));
        }).catch(error => {
            throw (error);
        });
    };
}

export function clearReportData() {
    const reportData = [];
    return { type: types.CLEAR_REPORT_DATA_SUCCESS, reportData};
}
