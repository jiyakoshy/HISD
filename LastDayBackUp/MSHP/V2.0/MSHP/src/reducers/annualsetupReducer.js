import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function annualsetupReducer(state = initialState.annualsetup, action) {
    switch (action.type) {
        case types.LOAD_ALL_ANNUALSETUP_SUCCESS:
            return action.annualsetup;
        case types.CLEAR_ANNUAL_SETUP_SUCCESS:
            return [];
        default:
            return state; 
    }
}
