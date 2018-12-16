import * as types from './actionTypes';
import EnrollmentApi from '../api/enrollmentApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadGradeLevelsByCampusAndYear(campusID, schoolYearEnd) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return EnrollmentApi.getGradeLevelsByCampusAndYear(campusID, schoolYearEnd).then(gradeLevelsObj => {
            let gradeLevels = [];
            gradeLevels= Utilities.sortGradeLevels(gradeLevelsObj.value);
            dispatch(loadGradeLevelsByCampusSuccess(gradeLevels));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadGradeLevelsByCampusSuccess(gradeLevels) {
    return { type: types.LOAD_GRADE_LEVELS_BY_CAMPUS_SUCCESS, gradeLevels };
}



