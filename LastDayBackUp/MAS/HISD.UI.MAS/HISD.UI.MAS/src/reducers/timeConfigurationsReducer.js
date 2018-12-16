import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function timeConfigurationsReducer(state = initialState.timeConfigs, action) {
    switch (action.type) {
        case types.CREATE_ACTIVITY_CODE_SUCCESS:
            return action.activityCode;
        case types.LOAD_ACTIVITY_CODE_SUCCESS:
            return action.activityCode;
        case types.LOAD_ACTIVITY_CODE_BY_NAME_SUCCESS:
            return action.activityCode;
        case types.UPDATE_ACTIVITY_CODE_SUCCESS:
            return { ...state, ActivityCodeDescription: action.activityCode.ActivityCodeDescription, ActivityCodeStatus: action.activityCode.Status};
        case types.DELETE_ACTIVITY_CODE_SUCCESS:
            return {};
        default:
            return state;
    }
}
