import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function errorReducer(state = initialState.errorMsg, action) {
    switch (action.type) {
        case types.LOG_ERROR_SUCCESS:
            return action.errorMsg;

        default:
            return state;
    }
}
