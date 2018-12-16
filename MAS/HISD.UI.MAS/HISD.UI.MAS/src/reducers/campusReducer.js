import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusReducer(state = initialState.campus, action) {
    switch (action.type) {
        case types.LOAD_CAMPUSESUSINGMAS_SUCCESS:
            return action.campus;
        default:
            return state;
    }
}
