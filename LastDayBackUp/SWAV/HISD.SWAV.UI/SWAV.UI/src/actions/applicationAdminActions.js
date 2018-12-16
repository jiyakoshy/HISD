import * as types from './actionTypes';
import ApplicationAdminApi from '../api/applicationAdminApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function waiverSettingsActionSuccess(settings) {
    return { type: types.LOAD_ALL_WAIVERS_SETTING_SUCCESS, settings };
}

export function postCopyWaiversSuccess() {
    return { type: types.POST_COPY_WAIVERS_SUCCESS };
}

export function waiverSettingsAction(startYear) {
    return function (dispatch) {
        return ApplicationAdminApi.getWaiverSettings(startYear).then(item => {
            dispatch(waiverSettingsActionSuccess(item.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function postWaiverSettingsAction(payload, startYear) {
    return function (dispatch) {
        return ApplicationAdminApi.postWaiverSettings(payload).then(item => {
            dispatch(waiverSettingsAction(startYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function patchWaiverSettingsAction(payload, settingsID, startYear) {
    return function (dispatch) {
        return ApplicationAdminApi.patchWaiverSettings(payload, settingsID).then(item => {
            dispatch(waiverSettingsAction(startYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function copyWaiversAction(startYear, endYear) {
    return function (dispatch) {
        return ApplicationAdminApi.getWaiversList(startYear).then(item => {
            const postPayload = Utilities.postCopyWaiversPayload(item.value, startYear, endYear);
            dispatch(postCopyWaivers(postPayload));
        }).catch(error => {
            throw (error);
        });
    };
}

export function postCopyWaivers(payload) {
    return function (dispatch) {
        return ApplicationAdminApi.postCopyWaivers(payload).then(() => {
            dispatch(postCopyWaiversSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}