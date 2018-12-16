import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusesContactsReducer(state = initialState.campusContacts, action) {
    switch (action.type) {
        case types.LOAD_ALL_CAMPUS_CONTACTS_SUCCESS:
            return action.campusContacts;
        case types.LOAD_CAMPUS_CONTACTS_BY_CAMPUSID_SUCCESS:
            return action.campusContacts;
        default:
            return state;
    }
}
