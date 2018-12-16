import * as types from './actionTypes';
import CentralOfficeApi from '../api/centralOfficeApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';



export function loadCentralOfficeDepartmentsSuccess(centralOffices) {
    return { type: types.LOAD_CENTRAL_OFFICE_DEPARTMENTS_SUCCESS, centralOffices};
}

export function loadCentralOfficeDepartments() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CentralOfficeApi.getCentralOfficeDepartments().then(centralOffices => {
            dispatch(loadCentralOfficeDepartmentsSuccess(centralOffices.value));
        }).catch(error => {
            throw (error);
        });
    };
}