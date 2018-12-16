import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import detailreportApi from '../api/detailreportApi';
import { Calendar } from 'office-ui-fabric-react';

export function loadDetailReportsSuccess(detailreport) {
    return { type: types.LOAD_ALL_DETAILREPORTS_SUCCESS, detailreport};
}

export function loadDetailReports(Schoolyear, compareDaySeq) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return detailreportApi.getDetailLevelAllReport(Schoolyear, compareDaySeq).then(detailreport => {
            dispatch(loadDetailReportsSuccess(detailreport.value));
        }).catch(error => {
            throw (error);
        });
    };
}