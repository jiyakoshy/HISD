import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function siteContentsReducer(state = initialState.siteContents, action) {
    switch (action.type) {
        case types.LOAD_ALL_SITE_CONTENTS_SUCCESS:
            return action.siteContents;

        default:
            return state;
    }
}
