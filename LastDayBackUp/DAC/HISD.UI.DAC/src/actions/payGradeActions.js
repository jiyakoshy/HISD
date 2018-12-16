import * as types from './actionTypes';
import PayGradeApi from '../api/payGradeApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';



export function loadPayGradesEmployeeSuccess(payGrades) {
    return { type: types.LOAD_PAY_GRADES_EMPLOYEE_SUCCESS, payGrades};
}

export function loadPayGradesEmployee(employeeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return PayGradeApi.loadPayGradesEmployee(employeeID).then(payGrades => {
            dispatch(loadPayGradesEmployeeSuccess(payGrades));
        }).catch(error => {
            throw (error);
        });
    };
}