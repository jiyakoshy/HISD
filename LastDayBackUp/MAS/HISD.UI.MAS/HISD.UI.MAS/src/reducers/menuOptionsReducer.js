import * as types from '../actions/actionTypes';
import initialState from './initialState';
import update from 'react-addons-update';

export default function menuOptionsReducer(state = initialState.menuOptions, action) {
    
    switch (action.type) {
        case types.LOAD_MENU_OPTIONS_SUCCESS:
            return action.menuOptions;
        case types.UPDATE_MENU_OPTIONS_SUCCESS:
        {
            return action.menuOptions;
        }
        default:
            return state;
    }
}
