import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadAllActivityMenteesSuccess(activityMentees) {
    return { type: types.LOAD_ALL_ACTIVITY_MENTEES_SUCCESS};
}

export function loadAllActivityMentees() {
    return function (dispatch) {
        return dispatch(loadAllActivityMenteesSuccess());
    };
}

export function createNewActivityMenteesSuccess(activityMentee) {
    return { type: types.NEW_ADD_ACTIVITY_MENTEE_SUCCESS, activityMentee};
}

export function createNewActivityMentees(activityMentee) {
    return function (dispatch) {
        return dispatch(createNewActivityMenteesSuccess(activityMentee));
    };
}

export function createActivityMenteesSuccess(activityMentees) {
    return { type: types.NEW_ADD_ACTIVITY_MENTEES_SUCCESS, activityMentees};
}

export function createActivityMentees(activityMentees) {
    return function (dispatch) {
        return dispatch(createActivityMenteesSuccess(activityMentees));
    };
}

export function deleteNewActivityMenteesSuccess(employeeID) {
    return { type: types.NEW_DELETE_ACTIVITY_MENTEE_SUCCESS, employeeID};
}

export function deleteNewActivityMentees(employeeID) {
    return function (dispatch) {
        return dispatch(deleteNewActivityMenteesSuccess(employeeID));
    };
}

export function deleteAllActivityMenteesSuccess() {
    return { type: types.NEW_DELETE_ALL_ACTIVITY_MENTEE_SUCCESS };
}

export function deleteAllActivityMentees() {
    return function (dispatch) {
        return dispatch(deleteAllActivityMenteesSuccess());
    };
}