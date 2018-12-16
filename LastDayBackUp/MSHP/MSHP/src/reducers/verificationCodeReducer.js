import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function verificationCodeReducer(state = initialState.verificationCode, action) {
    switch (action.type) {
        case types.LOAD_VERIFICATION_CODE_BY_PARENT_CODE_SUCCESS:
            return action.verificationCode;
        default:
            return state;
    }
}
