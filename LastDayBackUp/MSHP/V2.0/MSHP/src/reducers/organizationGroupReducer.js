import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function organizationGroupReducer(state = initialState.organizationGroup, action) {
    switch (action.type) {
        case types.LOAD_ORGANIZATION_GROUP_SUCCESS:
            return action.organizationGroup;
        case types.CLEAR_ORGANIZATION_GROUP_SUCCESS:
            return [];
        default:
            return state; 
    }
}
