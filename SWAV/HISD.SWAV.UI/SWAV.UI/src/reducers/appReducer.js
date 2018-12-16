import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function appReducer(state = initialState.appProps, action) {
    switch (action.type) {
        case types.LOAD_APP_PROPERTIES_SUCCESS:
            return action.appProps;

        default:
            return state;
    }
}
