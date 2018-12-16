import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import summarydetailreportApi from '../api/summarydetailreportApi';
import { Calendar } from 'office-ui-fabric-react';

export function loadsummarydetailReportsSuccess(summarydetailreport) {
    return { type: types.LOAD_ALL_SUMMARYDETAILREPORTS_SUCCESS, summarydetailreport};
}

export function loadsummarydetailReports(Schoolyear, compareDaySeq) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return summarydetailreportApi.getSummaryDetailReport(Schoolyear, compareDaySeq).then(summarydetailreport => {
            
            dispatch(loadsummarydetailReportsSuccess(summarydetailreport.value));
        }).catch(error => {
            throw (error);
        });
    };
}