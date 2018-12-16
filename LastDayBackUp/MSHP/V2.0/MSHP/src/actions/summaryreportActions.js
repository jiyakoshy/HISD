import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import summaryreportApi from '../api/summaryreportApi';
import { Calendar } from 'office-ui-fabric-react';

export function loadsummaryReportsSuccess(summaryreport) {
    return { type: types.LOAD_ALL_SUMMARYREPORTS_SUCCESS, summaryreport};
}

export function loadsummaryReports(Schoolyear, compareDaySeq) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return summaryreportApi.getsummaryReport(Schoolyear, compareDaySeq).then(summaryreport => {
            dispatch(loadsummaryReportsSuccess(summaryreport.value));
        }).catch(error => {
            throw (error);
        });
    };
}