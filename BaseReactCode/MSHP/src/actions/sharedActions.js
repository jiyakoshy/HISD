import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import {loadAllCampuses, loadCampusesByManager, loadCampusesByStaff} from '../actions/campusActions';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadUserSuccess(userProps) {
    return { type: types.LOAD_USER_SUCCESS, userProps };
}

export function loadUser() {
    return function (dispatch) {
      dispatch(beginAjaxCall());
      return SharedApi.getUserProperties().then(userProps => {
        dispatch(loadMenuOptions(userProps.user.role));
        dispatch(loadUserSuccess(userProps));
        if(userProps.user.role == 'Admin')
            dispatch(loadAllCampuses());
        else if(userProps.user.role == 'Principal')
            dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
        else if(userProps.user.role == 'Campus')
            dispatch(loadCampusesByManager(userProps.user.staffNaturalKey));
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
            //userProps.homePage = { type: userProps.user.role, content: "Welcome to MSHP.!" };
            dispatch(loadUserSuccess(userProps));
           
            if (userProps.user.role == 'Admin')
                dispatch(loadAllCampuses());
            else if (userProps.user.role == 'Principal')
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            else if (userProps.user.role == 'Reports')
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
            else // 
                dispatch(loadCampusesByStaff(userProps.user.staffNaturalKey));
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
