import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function taskIDReducer(state = initialState.taskID, action) {
    switch (action.type) {
        case types.GET_TASK_ID_SUCCESS:
            return action.taskID;
        default:
            return state;
    }
}
