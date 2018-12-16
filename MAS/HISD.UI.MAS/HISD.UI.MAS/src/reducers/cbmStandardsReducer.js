import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function cbmStandardsReducer(state = initialState.cbmStandards, action) {
    switch (action.type) {
        case types.LOAD_ALL_CBM_STANDARDS_SUCCESS:
            return action.cbmStandards;

        default:
            return state;
    }
}
