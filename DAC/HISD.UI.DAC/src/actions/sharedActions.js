import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import AdminApi from '../api/adminApi';
import { loadVotingSettingsActiveYear } from '../actions/votingSettingsAction';
import { loadAllCampuses, loadCampusesByManager } from '../actions/campusActions';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

export function loadUserSuccess(userProps) {
    return { type: types.LOAD_USER_SUCCESS, userProps };
}

export function loadCustomUserSuccess(userProps) {
    return { type: types.LOAD_CUSTOM_USER_SUCCESS, userProps };
}



export function loadUser() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getUserProperties().then(userProps => {
            dispatch(loadMenuOptions(userProps.user.role));
            const SchoolYearTypespromise = SharedApi.getSchoolYearTypes();
            SchoolYearTypespromise.then(res => {
                userProps.schoolYearDescription = res.value[0].Description;// "2016-2017";// res.value[0].Description;
                dispatch(loadVotingSettingsActiveYear(res.value[0].Description));
                const promise = AdminApi.getHomeMessage();
                promise.then(res => {
                    userProps.homePage = { messageHeader: res.value[0].HomeMessageHeader, messageBody: res.value[0].HomeMessageBody };
                    dispatch(loadUserSuccess(userProps));
                });
            });

            if (userProps.user.role == 'Admin')
                dispatch(loadAllCampuses());
            else if (userProps.user.role == 'Principal') {
                if (userProps.user.staffNaturalKey)
                    dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
                else
                    dispatch(loadCampusesByManager('94549'));
            }
            else if (userProps.user.role == 'SC') {
                if (userProps.user.staffNaturalKey)
                    dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
                else
                    dispatch(loadCampusesByManager('94549'));
            }
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
            const SchoolYearTypespromise = SharedApi.getSchoolYearTypes();
            SchoolYearTypespromise.then(res => {
                userProps.schoolYearDescription = res.value[0].Description;// "2016-2017";// res.value[0].Description;
                dispatch(loadVotingSettingsActiveYear(res.value[0].Description));
                const promise = AdminApi.getHomeMessage();
                promise.then(res => {
                    userProps.homePage = { messageHeader: res.value[0].HomeMessageHeader, messageBody: res.value[0].HomeMessageBody };
                    dispatch(loadUserSuccess(userProps));
                });
            });

            if (userProps.user.role == 'Admin')
                dispatch(loadAllCampuses());
            else if (userProps.user.role == 'Principal') {
                if (userProps.user.staffNaturalKey)
                    dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
                else
                    dispatch(loadCampusesByManager('94549'));
            }
            else if (userProps.user.role == 'SC') {
                if (userProps.user.staffNaturalKey)
                    dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
                else
                    dispatch(loadCampusesByManager('94549'));
            }
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

export function updateUserCampus(newCampus) {
    return function (dispatch) {
        dispatch(updateUserCampusSuccess(newCampus));
    };
}

export function updateUserHomePageSuccess(newHomePage) {
    return { type: types.UPDATE_USER_HOME_PAGE_SUCCESS, newHomePage };
}

export function loadSchoolYearTypesSuccess(schoolYear) {
    return { type: types.LOAD_SCHOOL_YEAR_TYPES_SUCCESS, schoolYear };
}

export function loadSchoolYearTypes() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharedApi.getSchoolYearTypes().then(schoolYear => {
            dispatch(loadSchoolYearTypesSuccess(schoolYear.value));
        }).catch(error => {
            throw (error);
        });
    };
}
