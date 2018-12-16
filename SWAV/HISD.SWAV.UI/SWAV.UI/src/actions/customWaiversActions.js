import * as types from './actionTypes';
import CustomWaiversApi from '../api/customWaiversApi';
import CampusApi from '../api/campusApi';
import SharePointApi from '../api/sharePointApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function getCustomWaiversActionSuccess(data) {
    return { type: types.LOAD_ALL_CUSTOM_WAIVERS_SUCCESS, data };
}

export function getCustomWaiversAction(schoolYear){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CustomWaiversApi.getCustomWaivers(schoolYear).then(data => {
            dispatch(getCustomWaiversActionSuccess(data.value));
      }).catch(error => {
          throw (error);
      });
    };
}

export function updateCustomWaiverAction(data, startYear, endYear) {
    const { wavierId } = data;
    return function (dispatch) {
        //dispatch(beginAjaxCall());
        const payload = Utilities.updateCustomWaiverPayload(data, startYear, endYear);
        return CustomWaiversApi.updateCustomWaivers(payload, wavierId).then(data => {
            dispatch(getCustomWaiversAction(startYear));
        }).catch(error => {
            //dispatch(error(NOTIFICATION_MSG));
            throw (error);
        });
    };
}

export function deleteCustomWaiverAction(schoolWaiverId, schoolYear) {
    return function (dispatch) {
        //dispatch(beginAjaxCall());
        return CustomWaiversApi.deleteCustomWaivers(schoolWaiverId).then(data => {
            dispatch(getCustomWaiversAction(schoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function approveCustomWaiverAction(schoolWaiverId, schoolYear) {
    return function (dispatch) {
        //dispatch(beginAjaxCall());
        return CustomWaiversApi.approveCustomWaivers(schoolWaiverId).then(data => {
            dispatch(getCustomWaiversAction(schoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function sendEmailSuccess() {
    return { type: types.SEND_EMAIL_SUCCESS };
}

export function sendEmail(email) {
    return function (dispatch) {
        //dispatch(beginAjaxCall());
        return CustomWaiversApi.sendEmail(email).then(response => {
            dispatch(sendEmailSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function rejectCustomWaiverAction(schoolWaiverId, schoolYear) {
    return function (dispatch) {
        //dispatch(beginAjaxCall());
        return CustomWaiversApi.rejectCustomWaivers(schoolWaiverId).then(data => {
            dispatch(getCustomWaiversAction(schoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function getEmailLoginID(data, comment) {
    const { CampusNumber } = data;
    return function (dispatch) {
        return CustomWaiversApi.getEmailLoginIDApi(CampusNumber).then(item => {
            const getLoginID = item.Staffs[0].LoginId;
            const getEmailObj = Utilities.sendEmailTemplate(data, comment, getLoginID);
            dispatch(sendEmail(getEmailObj));
        }).catch(error => {
            throw (error);
        });
    };
}
export function getApprovalEmailLoginID(data) {
    const { CampusNumber } = data;
    return function (dispatch) {
        return CustomWaiversApi.getEmailLoginIDApi(CampusNumber).then(item => {
            const getLoginID = item.Staffs[0].LoginId;
            const getEmailObj = Utilities.sendApprovalEmailTemplate(data, getLoginID);
            dispatch(sendEmail(getEmailObj));
        }).catch(error => {
            throw (error);
        });
    };
}

export function getSWAVAdminLoginIDAction(campusName){
    return function (dispatch){
        dispatch(beginAjaxCall());
        return CampusApi.getSWAVAdminLoginIDApi().then(data =>{
            const adminEmailIDs = Utilities.fetchEmailIDs(data, 'email');
            const getEmailObj = adminEmailIDs && Utilities.sendSubmittedEmailTemplate(campusName,adminEmailIDs) || {};
            dispatch(sendEmail(getEmailObj));
        }).catch(error => {
            throw (error);
        });
    };
}
