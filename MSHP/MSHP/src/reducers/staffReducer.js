import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function staffReducer(state = initialState.staff, action) {
    switch (action.type) {
        case types.LOAD_STAFF_BY_EMPLOYEEID_SUCCESS:
            return action.staff;
        default:
            return state;
    }
}
