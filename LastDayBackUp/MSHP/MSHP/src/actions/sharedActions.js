import * as types from './actionTypes';
import AdminApi from '../api/adminApi';
import SharedApi from '../api/sharedApi';
import MshpApi from '../api/mshpApi';
import { loadAllCampuses, loadCampusesByManager, loadCampusesByStaff } from '../actions/campusActions';
import { loadGradeLevelsByCampusAndYear, loadGradeLevelsByCampusSuccess } from '../actions/gradeLevelsActions';
import { loadHomeMessageByRole } from '../actions/adminActions';
import { loadCalendarReportDates } from '../actions/calendarReportDatesActions';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import { loadAllEnrollmentsByYearCampus, loadCampusProfile } from '../actions/enrollmentActions';

export function loadUserSuccess(userProps) {
    return { type: types.LOAD_USER_SUCCESS, userProps };
}

export function loadUser() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getUserProperties().then(userProps => {
            dispatch(loadMenuOptions(userProps.user.role));
            dispatch(loadUserSuccess(userProps));
            
            /* const promise = AdminApi.getHomeMessageByRole(userProps.user.role);
            promise.then(res => {
                userProps.homePage = { type: res.HomeMessageRole, content: res.HomeMessageContent };
                dispatch(loadUserSuccess(userProps));
            }); */
            
            
            if (userProps.user.role == 'Admin' || userProps.user.role == 'Reports')
                dispatch(loadAllCampuses());

            else // 
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            let currentSchoolYear = Utilities.getSchoolYear();
            //defaults ease some page initializations but will change later by admin using campus dropdowns, etc
            dispatch(loadCalendarReportDates(currentSchoolYear));
            dispatch(loadAllEnrollmentsByYearCampus(userProps.user.campusID, currentSchoolYear));
            dispatch(loadGradeLevelsByCampusAndYear(userProps.user.campusID,Utilities.getSchoolYearEnd()));
            dispatch(loadCampusProfile(userProps.user.campusID, currentSchoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}
{/*  was used by MAS
        else if(userProps.user.role == 'Principal')
            dispatch(loadCampusesByManager(userProps.user.staffNaturalKey)); */}

export function loadCustomUser(userID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getCustomUserProperties(userID).then(userProps => {
            console.log("userProps-----",userProps);
            dispatch(loadMenuOptions(userProps.user.role));
            dispatch(loadUserSuccess(userProps));
            /* const promise = AdminApi.getHomeMessageByRole(userProps.user.role);
            promise.then(res => {
                userProps.homePage = { type: res.HomeMessageRole, content: res.HomeMessageContent };
                dispatch(loadUserSuccess(userProps));
            }); */
            if (userProps.user.role == 'Admin' || userProps.user.role == 'Reports')
                dispatch(loadAllCampuses());

            else // 
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            let currentSchoolYear = Utilities.getSchoolYear();
            dispatch(loadAllEnrollmentsByYearCampus(userProps.user.campusID, currentSchoolYear));
            dispatch(loadGradeLevelsByCampusAndYear(userProps.user.campusID,Utilities.getSchoolYearEnd()));
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
        const promise = AdminApi.getHomeMessageByRole(newRole);
        promise.then(res => {
            let newHomePage = { type: res.HomeMessageRole, content: res.HomeMessageContent };
            dispatch(updateUserHomePageSuccess(newHomePage));
        });
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
            /* AdminApi.getCampusContactsByCampusID(newCampus.key).then(cicInfo => {
                if(cicInfo && cicInfo.value.length > 0){
                    user.campusContacts = cicInfo.value;
                }
                else{
                    user.campusContacts = [];
                }
                dispatch(updateUserCampusSuccess(user));
            }); */
            /* SharedApi.getGradeLevelsByCampusCurrentYear(newCampus.key).then(gradeLevelsInfo => {
                if (gradeLevelsInfo && gradeLevelsInfo.value.length > 0) {
                    user.campusGradeLevels = Utilities.sortGradeLevels(gradeLevelsInfo.value);
                }
                else {
                    user.campusGradeLevels = [];
                }
                dispatch(updateUserCampusSuccess(user));
            }); */

            MshpApi.getGradeLevelsByCampusAndYear(newCampus.key, schoolYear.substring(5,9)).then(gradeLevelsObj => {
                let gradeLevels = [];
                gradeLevels= Utilities.sortGradeLevels(gradeLevelsObj.value);
                dispatch(loadGradeLevelsByCampusSuccess(gradeLevels));
            });

            AdminApi.getCampusProfileIDForState(newCampus.key, Utilities.getSchoolYear()).then(profileIDInfo => {
                if (profileIDInfo) {
                    user.campusProfileID = profileIDInfo;
                }
                else {
                    user.campusProfileID = 0;
                }
                
                dispatch(updateUserCampusSuccess(user));
            });
            let currentSchoolYear = Utilities.getSchoolYear();
            dispatch(loadAllEnrollmentsByYearCampus(user.campusID, schoolYear));
            dispatch(loadCampusProfile(user.campusID, currentSchoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateUserHomePageSuccess(newHomePage) {
    return { type: types.UPDATE_USER_HOME_PAGE_SUCCESS, newHomePage };
}
