import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function campusProfileReducer(state = initialState.campusProfile, action) {
    switch (action.type) {
        case types.LOAD_CAMPUS_PROFILE_SUCCESS:
            return action.campusProfile;
        case types.UPDATE_CAMPUS_PROFILE_SUCCESS:
            return action.campusProfile;
        default:
            return state;
    }
}



