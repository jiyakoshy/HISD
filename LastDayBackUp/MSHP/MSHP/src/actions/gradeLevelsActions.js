import * as types from './actionTypes';
import MshpApi from '../api/mshpApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadGradeLevelsByCampusAndYear(campusID, schoolYearEnd) {
    debugger;
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.getGradeLevelsByCampusAndYear(campusID, schoolYearEnd).then(gradeLevelsObj => {
            console.log('gradeLevelsObj-----', gradeLevelsObj);
            let gradeLevels = [];
            gradeLevels= Utilities.sortGradeLevels(gradeLevelsObj.value);
           /* gradeLevelsObj.value.map(e => {
                let GradeValue = '';
                if (e.GradeLvlTypeNaturalKey == '1' ||
                    e.GradeLvlTypeNaturalKey == '2' ||
                    e.GradeLvlTypeNaturalKey == '3' ||
                    e.GradeLvlTypeNaturalKey == '4' ||
                    e.GradeLvlTypeNaturalKey == '5' ||
                    e.GradeLvlTypeNaturalKey == '6' ||
                    e.GradeLvlTypeNaturalKey == '7' ||
                    e.GradeLvlTypeNaturalKey == '8' ||
                    e.GradeLvlTypeNaturalKey == '9') {
                    GradeValue = '0' + e.GradeLvlTypeNaturalKey;
                }
                else {
                    GradeValue = e.GradeLvlTypeNaturalKey;
                }
                gradeLevels.push(
                    {
                        "gradeLevel": GradeValue,
                        "EducationOrgNaturalKey": e.EducationOrgNaturalKey,
                        "SchoolYearNaturalKey": e.SchoolYearNaturalKey
                    }
                );
            });
*/
            console.log('gradeLevels-----', gradeLevels);
            dispatch(loadGradeLevelsByCampusSuccess(gradeLevels));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadGradeLevelsByCampusSuccess(gradeLevels) {
    return { type: types.LOAD_GRADE_LEVELS_BY_CAMPUS_SUCCESS, gradeLevels }
}



