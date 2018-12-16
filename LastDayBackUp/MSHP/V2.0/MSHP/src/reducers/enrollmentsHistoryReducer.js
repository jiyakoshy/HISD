import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function enrollmentsHistoryReducer(state = initialState.enrollmentsHistory, action) {
    switch (action.type) {
        case types.LOAD_ALL_ENROLLMENTSHISTORY_SUCCESS:
            return action.enrollmentsHistory;
        default:
            return state;
    }
}
