import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function enrollmentReducer(state = initialState.enrollment, action) {
    switch (action.type) {

        case types.UPDATE_ENROLLMENT_SUCCESS:
            return { ...state, Id: action.enrollment.Id, UpdatedBy: action.enrollment.UpdatedBy, UpdatedDate: action.enrollment.UpdatedDate };
        case types.CREATE_CAMPUS_ENROLLMENT_SUCCESS:
            return action.enrollment;
        case types.LOAD_ONE_ENROLLMENT_SUCCESS:
            return action.enrollment;
        default:
            return state;
    }
}
