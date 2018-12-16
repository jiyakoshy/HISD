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
export function loadCampusesByStaff(staffNaturalKey) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCampusesByStaff(staffNaturalKey).then(employee => {
            let campuses = [];
            campuses.push(employee.EducationOrganization);
            dispatch(loadCampusesByStaffSuccess(campuses));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCampusesByStaffSuccess(campuses) {
    return { type: types.LOAD_CAMPUSES_BY_STAFF_SUCCESS, campuses};
}

export function clearCampuses() {
  
    const campuses = [];
    return { type: types.CLEAR_CAMPUSES_SUCCESS, campuses};
}


