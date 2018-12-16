import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function siteContentReducer(state = initialState.siteContent, action) {
    switch (action.type) {
        case types.CREATE_SITE_CONTENT_SUCCESS:
            return action.siteContent;
        case types.LOAD_SITE_CONTENT_SUCCESS:
            return action.siteContent;
        case types.LOAD_SITE_CONTENT_BY_CODE_SUCCESS:
            return action.siteContent;
        case types.UPDATE_SITE_CONTENT_SUCCESS:
            return {...state, SiteContentDescription: action.siteContent.SiteContentDescription};
        case types.DELETE_SITE_CONTENT_SUCCESS:
            return {};
        default:
            return state;
    }
}
