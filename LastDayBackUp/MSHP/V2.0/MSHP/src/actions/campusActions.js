import * as types from './actionTypes';
import CampusApi from '../api/campusApi';
import AdminApi from '../api/adminApi';
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

export function loadCSOByCampus(campusNumber){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return  CampusApi.getCSOByCampus(campusNumber).then(campusCSOs => {
            dispatch(loadCSOByCampusSuccess(campusCSOs));
        }).catch(error => {
        throw (error);
        });
    };
}

export function loadCSOByCampusSuccess(campusCSOs) {
    return { type: types.LOAD_CSO_CAMPUS_SUCCESS, campusCSOs};
}

export function loadAllCSOs(){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return  CampusApi.getAllCSOs().then(campusCSOs => {
            dispatch(loadAllCSOsSuccess(campusCSOs.value));
        }).catch(error => {
        throw (error);
        });
    };
}

export function loadAllCSOsSuccess(campusCSOs) {
    return { type: types.LOAD_ALL_CSOS_SUCCESS, campusCSOs};
}

export function loadCampusType(campusNumber){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return  CampusApi.getCampusTypeByCampus(campusNumber).then(campusType => {
            dispatch(loadCampusTypeSuccess(campusType.value));
        }).catch(error => {
        throw (error);
        });
    };
}

export function loadCampusTypeSuccess(campusType) {
    return { type: types.LOAD_CAMPUSTYPE_BY_CAMPUS_SUCCESS, campusType};
}

export function updateCampusProfile(campusProfile) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateCampusProfile(campusProfile).then(response => {
            dispatch(updateCampusProfileSuccess(campusProfile));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateCampusProfileSuccess(campusProfile) {
    return { type: types.UPDATE_CAMPUS_PROFILE_SUCCESS, campusProfile };
}