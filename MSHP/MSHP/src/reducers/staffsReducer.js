import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function staffsReducer(state = initialState.staffs, action) {
    switch (action.type) {
        case types.LOAD_STAFFS_BY_CAMPUSID_SUCCESS:
            return action.staffs;
        default:
            return state;
    }
}
