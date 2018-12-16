import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function mentoringToolsReducer(state = initialState.mentoringTools, action) {
    switch (action.type) {
        case types.LOAD_ALL_MENTORING_TOOLS_SUCCESS:
            return action.mentoringTools;

        default:
            return state;
    }
}
