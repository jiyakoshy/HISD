import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function payGradesReducer(state = initialState.payGrades, action) {
   
    switch (action.type) {
        
        case types.LOAD_PAY_GRADES_EMPLOYEE_SUCCESS:
            return action.payGrades;
       
        default:
            return state;
    }
}