import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function homeMessageReducer(state = initialState.homeMessage, action) {
    switch (action.type) {
        case types.CREATE_HOME_MESSAGE_SUCCESS:
            return action.homeMessage;
        case types.LOAD_HOME_MESSAGE_SUCCESS:
            return action.homeMessage;
        case types.LOAD_HOME_MESSAGE_BY_ROLE_SUCCESS:
            return action.homeMessage;
        case types.LOAD_HOME_MESSAGE_BY_ROLE_WITHOUT_DATES_SUCCESS:
            return action.homeMessage;    
        case types.UPDATE_HOME_MESSAGE_SUCCESS:
            return {...state, HomeMessageRole: action.homeMessage.HomeMessageRole, StartDate: action.homeMessage.StartDate, EndDate: action.homeMessage.EndDate, HomeMessageContent: action.homeMessage.HomeMessageContent};
        case types.DELETE_HOME_MESSAGE_SUCCESS:
            return {};
        default:
            return state;
    }
}
