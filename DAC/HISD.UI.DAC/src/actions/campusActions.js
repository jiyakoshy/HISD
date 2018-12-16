import * as types from './actionTypes';
import CampusApi from '../api/campusApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadAllCampusesSuccess(campuses) {
    return { type: types.LOAD_ALL_CAMPUSES_SUCCESS, campuses};
}

export function loadAllCampuses() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getAllCampuses().then(campuses => {
            dispatch(loadAllCampusesSuccess(campuses.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCampusesByManagerSuccess(campuses) {
    return { type: types.LOAD_CAMPUSES_BY_MANAGER_SUCCESS, campuses};
}

export function loadCampusesByManager(managerStaffNaturalKey) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCampusesByManager(managerStaffNaturalKey).then(employee => {
            let campuses = [];
            employee.SchoolManagers.forEach(function(item) {
                campuses.push(item.EducationOrganization);
            });
            dispatch(loadCampusesByManagerSuccess(campuses));
        }).catch(error => {
            throw (error);
        });
    };
    
}

export function loadCentralOfficeDepartmentsSuccess(campuses) {
    return { type: types.LOAD_CENTRAL_OFFICE_DEPARTMENTS_SUCCESS, campuses};
}

export function loadCentralOfficeDepartments() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCentralOfficeDepartments().then(campuses => {
            dispatch(loadCentralOfficeDepartmentsSuccess(campuses.value));
        }).catch(error => {
            throw (error);
        });
    };
}