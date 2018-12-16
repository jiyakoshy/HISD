import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function menteesEndDatesReducer(state = initialState.menteesEndDates, action) {
    switch (action.type) {
        case types.LOAD_ALL_MENTEES_ENDDATES_SUCCESS:
            return action.menteesEndDates;
        case types.LOAD_MENTEES_ENDDATES_BY_CAMPUSID_SUCCESS:
            return action.menteesEndDates;

        default:
            return state;
    }
}
