import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function staffsReducer(state = initialState.csoStaffs, action) {
    switch (action.type) {
        case types.LOAD_ALLCSO_SUCCESS:
            return action.csoStaffs;
        default:
            return state;
    }
}
