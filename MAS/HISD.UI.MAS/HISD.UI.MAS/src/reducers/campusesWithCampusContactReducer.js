import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusesReducer(state = initialState.campusesWithCampusContact, action) {
    switch (action.type) {
        case types.LOAD_ALLCAMPUSESWITHCAMPUSCONTACT_SUCCESS:
            return action.campusesWithCampusContact;
        default:
            return state;
    }
}
