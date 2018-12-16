import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function relationshipReducer(state = initialState.relationship, action) {
    switch (action.type) {
        case types.CREATE_RELATIONSHIP_SUCCESS:
            return action.relationship;
        case types.CREATE_RELATIONSHIP_REQUEST_SUCCESS:
            return {};
        case types.UPDATE_RELATIONSHIP_SUCCESS:
            return action.relationship;
        case types.UPDATE_RELATIONSHIP_REQUEST_SUCCESS:
            return {};
        case types.LOAD_RELATIONSHIP_BY_ID_SUCCESS:
            return action.relationship;
        case types.LOAD_RELATIONSHIP_BY_MENTOR_AND_MENTEE_SUCCESS:
            return action.relationship;
        case types.DELETE_RELATIONSHIP_SUCCESS:
            return {};
        // dashboard: relationshipstatus summary
        case types.LOAD_RELATIONSHIPSTATUSSUMMARY_BY_CAMPUSID_SUCCESS:
            return action.relationship;    
        case types.LOAD_ALLRELATIONSHIPSCOUNTBYSTATUS_SUCCESS:
            return action.relationship;    
        default:
            return state;
    }
}
