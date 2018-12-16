import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function menteesReducer(state = initialState.mentees, action) {
    switch (action.type) {
        case types.LOAD_ALL_MENTEES_SUCCESS:
            return action.mentees;
        case types.LOAD_MENTEES_BY_CAMPUS_SUCCESS:
            return action.mentees;
        case types.LOAD_MENTEES_IN_RELATIONSHIP_BY_MENTORID_SUCCESS:
            return action.mentees;

        default:
            return state;
    }
}
