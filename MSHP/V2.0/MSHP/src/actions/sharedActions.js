import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import EnrollmentApi from '../api/enrollmentApi';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import { loadCampusProfile,loadCurrentSchoolYear,loadEnrollmentHistoryByCampusProfile, loadAllSchoolYears } from '../actions/enrollmentActions';
import { loadAllEnrollmentsByYearCampus} from '../actions/enrollmentInputActions';
import { loadAllCompareDaySeq } from '../actions/nonReportSchoolActions';
import { loadCalendarReportDates } from '../actions/calendarReportDatesActions';
import { loadAllCampuses, loadCampusesByManager, loadCampusesByStaff } from '../actions/campusActions';
import { loadGradeLevelsByCampusAndYear, loadGradeLevelsByCampusSuccess } from '../actions/gradeLevelsActions';

export function loadUserSuccess(userProps) {
    return { type: types.LOAD_USER_SUCCESS, userProps };
}

export function loadUser() {
    return function (dispatch) {
      dispatch(beginAjaxCall());
      let campusID = '';
      return SharedApi.getUserProperties().then(userProps => {
        dispatch(loadMenuOptions(userProps.user.role));
        dispatch(loadUserSuccess(userProps));
        if(userProps.user.role == 'Admin')
            dispatch(loadAllCampuses());
        else if(userProps.user.role == 'Campus')
            dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
        else if(userProps.user.role == 'Report')
            dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
            // if (userProps.user.campusID.length > 3){
            //     campusID = '001';
            // }
            // else{
            //     campusID = userProps.user.campusID;
            // }
        let currentSchoolYear = Utilities.getSchoolYear();
        dispatch(loadAllSchoolYears());
        dispatch(loadCurrentSchoolYear());
        dispatch(loadEnrollmentHistoryByCampusProfile(currentSchoolYear, userProps.user.campusID));
        dispatch(loadAllCompareDaySeq(currentSchoolYear));
        dispatch(loadCalendarReportDates(currentSchoolYear));
        dispatch(loadAllEnrollmentsByYearCampus(userProps.user.campusID, currentSchoolYear));
        dispatch(loadGradeLevelsByCampusAndYear(userProps.user.campusID, Utilities.getSchoolYearEnd()));
        dispatch(loadCampusProfile(userProps.user.campusID, currentSchoolYear));
    }).catch(error => {
        throw (error);
    });
  };
}

export function loadCustomUser(userID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getCustomUserProperties(userID).then(userProps => {
            dispatch(loadMenuOptions(userProps.user.role));
            userProps.homePage = { type: userProps.user.role, content: "Welcome to MSHP.!" };
            dispatch(loadUserSuccess(userProps));
           
            if (userProps.user.role == 'Admin')
                dispatch(loadAllCampuses());
            else if (userProps.user.role == 'Principal')
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            else if (userProps.user.role == 'Report')
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            else if (userProps.user.role == 'Campus')
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            let currentSchoolYear = Utilities.getSchoolYear();
            dispatch(loadAllEnrollmentsByYearCampus(userProps.user.campusID, currentSchoolYear));
            dispatch(loadGradeLevelsByCampusAndYear(userProps.user.campusID,Utilities.getSchoolYearEnd()));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadApplicationPropertiesSuccess(appProps) {
    return { type: types.LOAD_APP_PROPERTIES_SUCCESS, appProps };
}

export function loadApplicationProperties() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getApplicationProperties().then(appProps => {
            dispatch(loadApplicationPropertiesSuccess(appProps));
        }).catch(error => {
            throw (error);
        });
    };
}

export function logErrorSuccess(errorMsg) {
    return { type: types.LOG_ERROR_SUCCESS, errorMsg };
}

export function updateUserRoleSuccess(newRole) {
    return { type: types.UPDATE_USER_ROLE_SUCCESS, newRole };
}

export function updateUserRole(newRole) {
    return function (dispatch) {
        dispatch(updateUserRoleSuccess(newRole));
    };
}

export function loadMenuOptionsSuccess(menuOptions) {
    localStorage.setItem("menu", JSON.stringify(menuOptions));
    return { type: types.LOAD_MENU_OPTIONS_SUCCESS, menuOptions };
}

export function loadMenuOptions(role) {
    return function (dispatch) {
      dispatch(beginAjaxCall());
      return SharedApi.getNavigationItems(role).then(menuOptions => {
          dispatch(loadMenuOptionsSuccess(menuOptions));
    }).catch(error => {
        throw (error);
    });
  };
}

export function updateMenuOptions(role) {
    return function (dispatch) {
      dispatch(beginAjaxCall());
      return SharedApi.getNavigationItems(role).then(menuOptions => {
          dispatch(updateMenuOptionsSuccess(menuOptions));
    }).catch(error => {
        throw (error);
    });
  };
}

export function updateMenuOptionsSuccess(menuOptions) {
    localStorage.setItem("menu", JSON.stringify(menuOptions));
    return { type: types.UPDATE_MENU_OPTIONS_SUCCESS, menuOptions };
}

export function updateUserCampusSuccess(newCampus) {
    return { type: types.UPDATE_USER_CAMPUS_SUCCESS, newCampus };
}


export function updateUserCampus(newCampus, schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        //if (newCampus.key > 3)  newCampus.key = '001';
        return SharedApi.getPrincipal(newCampus.key).then(principalInfo => {
            let user = { campusID: newCampus.key, campusName: newCampus.text, isChoseSchool: true };
            if (principalInfo && principalInfo.SchoolManagers && principalInfo.SchoolManagers.CILSchoolManager) {
                user.principalEmployeeID = principalInfo.SchoolManagers.CILSchoolManager.StaffNaturalKey;
                user.principalName = principalInfo.SchoolManagers.CILSchoolManager.FirstName + " " + principalInfo.SchoolManagers.CILSchoolManager.LastSurname;
                user.principalLoginID = principalInfo.SchoolManagers.CILSchoolManager.LoginId;
            }
            else {
                user.principalEmployeeID = "";
                user.principalName = "";
                user.principalLoginID = "";
            }

            EnrollmentApi.getGradeLevelsByCampusAndYear(newCampus.key, schoolYear.substring(5,9)).then(gradeLevelsObj => {
                let gradeLevels = [];
                gradeLevels= Utilities.sortGradeLevels(gradeLevelsObj.value);
                dispatch(loadGradeLevelsByCampusSuccess(gradeLevels));
            });

            EnrollmentApi.getCampusProfileIDForState(newCampus.key, Utilities.getSchoolYear()).then(profileIDInfo => {
                if (profileIDInfo) {
                    user.campusProfileID = profileIDInfo;
                }
                else {
                    user.campusProfileID = 0;
                }
                
                dispatch(updateUserCampusSuccess(user));
            });
            let currentSchoolYear = Utilities.getSchoolYear();
            let schoolyearend = Utilities.getSchoolYearEnd();
            dispatch(loadAllCompareDaySeq(currentSchoolYear));
            dispatch(loadAllEnrollmentsByYearCampus(user.campusID, currentSchoolYear));
            dispatch(loadCampusProfile(user.campusID, currentSchoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateUserHomePageSuccess(newHomePage) {
    return { type: types.UPDATE_USER_HOME_PAGE_SUCCESS, newHomePage };
}
