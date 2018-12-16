import * as types from './actionTypes';
import GeneralWaiversApi from '../api/generalWaiversApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import { error } from 'react-notification-system-redux';
import { NOTIFICATION_MSG } from '../constants/constant';

export function getGeneralWaiversActionSuccess(data) {
    return { type: types.LOAD_ALL_GENERAL_WAIVERS_SUCCESS, data };
}

export function getGeneralWaiversAction(schoolYear) {
    return function (dispatch) {
        //dispatch(beginAjaxCall());
        return GeneralWaiversApi.getGeneralWaivers(schoolYear).then(data => {
            dispatch(getGeneralWaiversActionSuccess(data.value));
        }).catch(error => {
            //dispatch(error(NOTIFICATION_MSG));
            throw (error);
        });
    };
}

export function deleteGeneralWaiverAction(waiverID, schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return GeneralWaiversApi.deleteGeneralWaivers(waiverID).then(data => {
            dispatch(getGeneralWaiversAction(schoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function addGeneralWaiverAction(data, startYear, endYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        const payload = Utilities.addGeneralWaiverPayload(data, startYear, endYear);
        return GeneralWaiversApi.addGeneralWaivers(payload).then(data => {
            dispatch(getGeneralWaiversAction(startYear));
            
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateGeneralWaiverAction(data, startYear, endYear) {
    const { wavierId } = data;
    return function (dispatch) {
        dispatch(beginAjaxCall());
        const payload = Utilities.updateGeneralWaiverPayload(data, startYear, endYear);
        return GeneralWaiversApi.updateGeneralWaivers(payload, wavierId).then(data => {
            dispatch(getGeneralWaiversAction(startYear));
        }).catch(error => {
            throw (error);
        });
    };
}

