import * as types from '../actions/actionTypes';
import initialState from './initialState';
import * as ActionHelper from '../actions/actionHelper/ActionHelper';

export default function applicationAdminReducer(state = initialState.generalWaiversProps, action) {
    switch (action.type) {
        case types.LOAD_ALL_GENERAL_WAIVERS_SUCCESS:
            return {
                ...state,
                waviersList : action.data
            }
        default:
            return state;
    }
}