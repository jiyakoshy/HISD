import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function mentorsReducer(state = initialState.mentors, action) {
    switch (action.type) {
        case types.LOAD_ALL_MENTORS_SUCCESS:
            return action.mentors;
        case types.LOAD_MENTORS_BY_CAMPUS_SUCCESS:
            return action.mentors;
        case types.LOAD_MENTORS_IN_RELATIONSHIP_BY_CAMPUS_SUCCESS:
            return action.mentors;
        default:
            return state;
    }
}
