import * as types from './actionTypes';
import CampusApi from '../api/campusApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import ApplicationAdminApi from '../api/applicationAdminApi';

export function loadAllCampusesSuccess(campuses) {
    return { type: types.LOAD_ALL_CAMPUSES_SUCCESS, campuses};
}

export function loadAllSchoolSuccess(schools) {
    return { type: types.LOAD_ALL_SCHOOLS_SUCCESS, schools};
}

export function waiverSettingsActionSuccess(settings) {
    return { type: types.LOAD_ALL_WAIVERS_SETTING_SUCCESS, settings };
}

export function editWaiversPermissionAction(data) {
    return { type: types.WAIVERS_EDIT_PERMISSION, data };
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

export function loadAllSchools(year) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getAllSchools(year).then(schools => {
            //dispatch(loadAllCampuses());
            dispatch(loadAllSchoolSuccess(schools.value));
        }).catch(error => {
            throw (error);
        });
    };
}


export function getCurrentSchoolYearSuccess(details) {
    return { type: types.GET_CURRENT_SCHOOL_YEAR_SUCCESS, details };
}

export function getCurrentSchoolYearAction(year){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.geCurrentSchoolYearAPI(year).then(data => {
            dispatch(getCurrentSchoolYearSuccess(data));
      }).catch(error => {
          throw (error);
      });
    };
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