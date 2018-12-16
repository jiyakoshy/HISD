import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function timeConfigReducer(state = initialState.timeConfig, action) {
    switch (action.type) {
        case types.CREATE_TIME_CONFIG_SUCCESS:
            return action.timeConfig;
        case types.LOAD_TIME_CONFIG_SUCCESS:
            return action.timeConfig;
        case types.LOAD_CURRENT_TIME_CONFIG_SUCCESS:
            return action.timeConfig;
        case types.LOAD_TIME_CONFIG_BY_SCHOOL_YEAR_SUCCESS:
            return action.timeConfig;
        case types.UPDATE_TIME_CONFIG_SUCCESS:
            return { ...state, LogStartDate: action.timeConfig.LogStartDate, LogEndDate: action.timeConfig.LogEndDate, SchoolStartDate: action.timeConfig.SchoolStartDate, SchoolEndDate: action.timeConfig.SchoolEndDate, SchoolYear: action.timeConfig.SchoolYear};
        case types.DELETE_TIME_CONFIG_SUCCESS:
            return {};
        default:
            return state;
    }
}
