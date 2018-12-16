import * as types from '../actions/actionTypes';
import initialState from './initialState';
import * as ActionHelper from '../actions/actionHelper/ActionHelper';

export default function applicationAdminReducer(state = initialState.adminProps, action) {
    switch (action.type) {
        case types.LOAD_ALL_WAIVERS_SETTING_SUCCESS:
            return ActionHelper.updateWaiversSetting(state, action);
        default:
            return state;
    }
}
