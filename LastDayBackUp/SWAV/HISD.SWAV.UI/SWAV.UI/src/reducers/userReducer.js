import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.userProps, action) {
    switch (action.type) {
        case types.LOAD_USER_SUCCESS:
            return action.userProps;
        case types.UPDATE_USER_ROLE_SUCCESS:
            return {
                ...state, 
                user: {
                    ...state.user,
                    role: action.newRole,
                    roles: [...state.user.roles]
                }
            };
        case types.GET_PRINCIPAL_NAME_SUCCESS:
            return {
                ...state, 
                user: {
                    ...state.user,
                    campusID: action.newCampus.campusID,
                    campusName: action.newCampus.campusName,
                    principalName : action.newCampus.principalName
                }
            };
        case types.UPDATE_USER_HOME_PAGE_SUCCESS:
            return {
                ...state, 
                homePage: { type: action.newHomePage.type, content: action.newHomePage.content }
            };        
        default:
            return state;
    }
}
