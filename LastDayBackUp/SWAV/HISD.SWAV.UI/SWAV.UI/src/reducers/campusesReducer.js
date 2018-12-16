import * as types from '../actions/actionTypes';
import initialState from './initialState';
import * as ActionHelper from '../actions/actionHelper/ActionHelper';

export default function campusesReducer(state = initialState.campusesProps, action) {
    switch (action.type) {
        case types.LOAD_ALL_CAMPUSES_SUCCESS:
            return {
                ...state,
                campusesDropDownList: action.campuses
            };
        case types.LOAD_CAMPUSES_BY_MANAGER_SUCCESS:
            return{
                ...state,
                campusesDropDownList: action.campuses
            };
        case types.LOAD_ALL_WAIVERS_SUCCESS:
            return {
                ...state,
                waiversList: action.waivers
            };
        case types.WAIVERS_EDIT_PERMISSION:
            return {
                ...state,
                isAllowed: action.data
            };
        case types.CLEAR_ACTION:
            return { ...state, waiversList: '', customWaiversList: '' };
        case types.LOAD_ALL_SCHOOLS_SUCCESS:
            return ActionHelper.fetchSchoolList(state, action);
        case types.GET_SCHOOL_CAMPUS_DETAILS:
            return ActionHelper.getSchoolDetails(state, action);
        case types.GET_CURRENT_SCHOOL_YEAR_SUCCESS:
            return ActionHelper.getUserCurrentYear(state, action);
        case types.LOAD_ALL_SAVED_WAIVERS_SUCCESS:
            return ActionHelper.updateWaiverDetails(state, action);
        case types.SAVE_SCHOOL_DETAILS_SUCCESS:
            return { ...state, campusNumber: action.data.ID, campusName: action.data.campusName };
        case types.SAVE_STATUS:
            return ActionHelper.getWaiversStatus(state, action);
        case types.LOAD_ALL_CUSTOM_WAIVERS_SUCCESS:
           return ActionHelper.fetchCustomWaviersDetails(state, action);  
        case types.LOAD_ALL_WAIVER_REQUEST_SUCCESS:
           return ActionHelper.fetchWaviersRequestDetails(state, action);
        case types.GET_SSO_DETAILS_SUCCESS:
           return ActionHelper.fetchUp1ManagersDetails(state, action);
        case types.GET_SUP_DETAILS_SUCCESS:
           return ActionHelper.fetchUp2ManagersDetails(state, action);         
        case types.GET_REQUEST_FORM_DETAILS_SUCCESS:
        return {
            ...state, getRequestDetails:action.details
        };
        case types.CLEAR_REQUEST_FORM_ACTION:
            return { ...state, addRequestFormList: [] };          
        default:
            return state;
    }
}
