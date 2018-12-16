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


export function createMentorActivityLog(mentorActivityLogData) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharePointApi.createMentorActivityLog(mentorActivityLogData).then(response => {
            dispatch(createMentorActivityLogSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createMentorActivityLogSuccess(mentorActivityLog) {
    return { type: types.CREATE_MENTOR_ACTIVITY_LOG_SUCCESS, mentorActivityLog };
}


export function updateMentorActivityLog(mentorActivityLogData) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharePointApi.updateMentorActivityLog(mentorActivityLogData).then(response => {
            dispatch(updateMentorActivityLogSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateMentorActivityLogSuccess(mentorActivityLog) {
    return { type: types.UPDATE_MENTOR_ACTIVITY_LOG_SUCCESS, mentorActivityLog };
}
