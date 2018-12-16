import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function spUserPropsReducer(state = initialState.spUserProps, action) {
    switch (action.type) {
        case types.LOAD_SP_USER_PROPS_SUCCESS:
            return action.spUserProps;
        case types.SEND_EMAIL_SUCCESS:
            return {};
        default:
            return state;
    }
}
