import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import enrollmentApi from '../api/enrollmentApi';
import React from 'react';

export function loadAllEnrollmentSuccess(enrollments) {
    return { type: types.LOAD_ALL_ENROLLMENTS_SUCCESS, enrollments};
}

export function loadAllEnrollmentHistorySuccess(enrollmentsHistory) {
    return { type: types.LOAD_ALL_ENROLLMENTSHISTORY_SUCCESS, enrollmentsHistory};
}

export function loadCurrentSchoolYearSuccess(schoolYear) {
    return { type: types.LOAD_CURRENT_SCHOOLYEAR_SUCCESS, schoolYear};
}

export function loadAllSchoolYearSuccess(schoolYears) {
    return { type: types.LOAD_ALL_SCHOOLYEARS_SUCCESS, schoolYears};
}

export function loadEnrollmentHistoryByCampusProfile(SchoolYear, CampusId) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return enrollmentApi.getEnrollmentHistory(SchoolYear, CampusId).then(enrollmentsHistory => {
            dispatch(loadAllEnrollmentHistorySuccess(enrollmentsHistory.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllSchoolYears() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return enrollmentApi.getSchoolYears().then(syears => {
            let schoolYears = [];
            for (let k = 0; k < syears.value.length; k++) {
                schoolYears.push(<option key={syears.value[k]} value={syears.value[k]}> {syears.value[k]} </option>);
              }
            dispatch(loadAllSchoolYearSuccess(schoolYears));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCurrentSchoolYear() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return enrollmentApi.getSchoolYear().then(schoolYear => {
            dispatch(loadCurrentSchoolYearSuccess(schoolYear.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateSchoolYearSuccess(schoolYear) {
    return { type: types.UPDATE_SCHOOL_YEAR_SUCCESS, schoolYear };
}

export function updateSchoolYear(schoolYear) {
    return function (dispatch) {
        dispatch(updateSchoolYearSuccess(schoolYear));
    };
}

export function loadCampusProfile(campusID, schoolYear) {
    return function (dispatch) {
    dispatch(beginAjaxCall());
    if (campusID.length > 3)  campusID = '001';
    return enrollmentApi.getProfile(campusID, schoolYear).then( campusProfileObj => {
        let campusProfile = {};
            if(campusProfileObj)
            campusProfile = campusProfileObj;
        dispatch(loadCampusProfileSuccess(campusProfile));
    }).catch(error => {
        throw (error);
    });
};
}
export function loadCampusProfileSuccess(campusProfile){
    return { type: types.LOAD_CAMPUS_PROFILE_SUCCESS, campusProfile};
}