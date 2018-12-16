import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function timeConfigsReducer(state = initialState.timeConfigs, action) {
    switch (action.type) {
        case types.LOAD_ALL_TIME_CONFIGS_SUCCESS:
            return action.timeConfigs;

        default:
            return state;
    }
}
