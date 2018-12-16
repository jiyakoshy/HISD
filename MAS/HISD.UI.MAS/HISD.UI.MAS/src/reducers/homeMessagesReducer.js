import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function homeMessagesReducer(state = initialState.homeMessages, action) {
    switch (action.type) {
        case types.LOAD_ALL_HOME_MESSAGES_SUCCESS:
            return action.homeMessages;

        default:
            return state;
    }
}
