import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function verificationCodeDetailsReducer(state = initialState.verificationCodeDetails, action) {
    switch (action.type) {
        case types.CREATE_VERIFICATION_CODE_DETAILS_SUCCESS:
            return action.verificationCodeDetails;
        case types.LOAD_VERIFICATION_CODE_DETAILS_SUCCESS:
            return action.verificationCodeDetails;
        case types.UPDATE_VERIFICATION_CODE_DETAILS_SUCCESS:
            return { ...state, MultiChoiceListItemDescription: action.verificationCodeDetails.MultiChoiceListItemDescription};
        case types.DELETE_VERIFICATION_CODE_DETAILS_SUCCESS:
            return {};
        default:
            return state;
    }
}
