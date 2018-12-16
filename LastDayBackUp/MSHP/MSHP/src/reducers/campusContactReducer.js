import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusContactReducer(state = initialState.campusContact, action) {
    switch (action.type) {
        case types.LOAD_CAMPUS_CONTACT_BY_CAMPUSID_AND_EMPLOYEEID_SUCCESS:
            return action.campusContact;
        case types.CREATE_CAMPUS_CONTACT_SUCCESS:
            return action.campusContact;
        case types.UPDATE_CAMPUS_CONTACT_SUCCESS:
        return { ...state, CICEmployeeID: action.campusContact.CICEmployeeID };
        case types.DELETE_CAMPUS_CONTACT_SUCCESS:
            return {};
        default:
            return state;
    }
}
