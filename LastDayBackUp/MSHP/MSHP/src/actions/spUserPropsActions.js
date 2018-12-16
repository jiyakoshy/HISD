import * as types from './actionTypes';
import SharePointApi from '../api/sharePointApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadSPUserPropsSuccess(spUserProps) {
    return { type: types.LOAD_SP_USER_PROPS_SUCCESS, spUserProps};
}

export function loadSPUserProps(loginID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharePointApi.getSPUserPropertiesByLoginID(loginID).then(spUserProps => {
            dispatch(loadSPUserPropsSuccess(spUserProps.data));
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
        dispatch(beginAjaxCall());
        return SharePointApi.sendEmail(email).then(response => {
            dispatch(sendEmailSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}