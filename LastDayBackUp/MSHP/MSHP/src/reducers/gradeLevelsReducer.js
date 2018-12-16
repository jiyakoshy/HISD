import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function gradeLevelsReducer(state = initialState.gradeLevels, action) {
    switch (action.type) {
        case types.LOAD_GRADE_LEVELS_BY_CAMPUS_SUCCESS:
            return action.gradeLevels;
        default:
            return state;
    }
}
