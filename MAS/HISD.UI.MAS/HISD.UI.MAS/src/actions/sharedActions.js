import * as types from './actionTypes';
import AdminApi from '../api/adminApi';
import SharedApi from '../api/sharedApi';
import { loadAllCampuses, loadCampusesByManager } from '../actions/campusActions';
import { loadHomeMessageByRole } from '../actions/adminActions';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

export function loadUserSuccess(userProps) {
    return { type: types.LOAD_USER_SUCCESS, userProps };
}

export function loadUser() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getUserProperties().then(userProps => {
            dispatch(loadMenuOptions(userProps.user.role));
            const promise = AdminApi.getHomeMessageByRole(userProps.user.role);
            promise.then(res => {
                userProps.homePage = { type: res.HomeMessageRole, content: res.HomeMessageContent };
                dispatch(loadUserSuccess(userProps));
            });
            if (userProps.user.role == 'Admin')
                dispatch(loadAllCampuses());
            else if (userProps.user.role == 'Principal')
                dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
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

//custom login --- start
export function loadCustomUser(userID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getCustomUserProperties(userID).then(userProps => {
            dispatch(loadMenuOptions(userProps.user.role));
                const promise = AdminApi.getHomeMessageByRole(userProps.user.role);
                promise.then(res => {
                    userProps.homePage = { type: res.HomeMessageRole, content: res.HomeMessageContent };
                    dispatch(loadUserSuccess(userProps));
                });
                if (userProps.user.role == 'Admin')
                    dispatch(loadAllCampuses());
                else if (userProps.user.role == 'Principal')
                    dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
           
        }).catch(error => {
            throw (error);
        });

        // }
    };
}
// custom login --- ends

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

export function updateUserCampus(newCampus) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getPrincipal(newCampus.key).then(principalInfo => {
            let user = { campusID: newCampus.key, campusName: newCampus.text };
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
            AdminApi.getCampusContactsByCampusID(newCampus.key).then(cicInfo => {
                if (cicInfo && cicInfo.value.length > 0) {
                    user.campusContacts = cicInfo.value;
                }
                else {
                    user.campusContacts = [];
                }
                dispatch(updateUserCampusSuccess(user));
            });

        }).catch(error => {
            throw (error);
        });
    };
}

export function updateUserHomePageSuccess(newHomePage) {
    return { type: types.UPDATE_USER_HOME_PAGE_SUCCESS, newHomePage };
}

export function sendEmailCIC(email) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.sendEmail(email).then(response => {
            dispatch(sendEmailCICSuccess(email));
        }).catch(error => {
            throw (error);
        });
    };
}

export function sendEmailCICSuccess(email) {
    return { type: types.SEND_EMAIL_SUCCESS };
}
