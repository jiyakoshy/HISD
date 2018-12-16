import * as types from '../actions/actionTypes';
import initialState from './initialState';
import * as ActionHelper from '../actions/actionHelper/ActionHelper';

export default function waiversReducer(state = initialState.waivers, action) {
    switch (action.type) {
        case types.HANDLE_SELECTED_WAIVERS:
            return ActionHelper.updateWaiverList(state, action);
        case types.SCHOOL_TYPE_SUCCESS:
            return {...state, schoolType : action.data};      
        default:
            return state;
    }
}
