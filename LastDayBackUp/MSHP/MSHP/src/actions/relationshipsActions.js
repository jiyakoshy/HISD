import * as types from './actionTypes';
import RelationshipsApi from '../api/relationshipsApi';
import SharePointApi from '../api/sharePointApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

export function loadRelationshipsByCampusIDSuccess(relationships) {
    return { type: types.LOAD_RELATIONSHIPS_BY_CAMPUSID_SUCCESS, relationships };
}

export function loadRelationshipsByCampusID(campusID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getRelationshipsByCampusID(campusID, timeConfigurationID).then(relationshipsObj => {
            let relationships = [];
            if(relationshipsObj.value && relationshipsObj.value.length > 0){
                relationshipsObj.value.forEach(function(element) {
                    element.MentorName = element.MentorFirstName + " " + element.MentorLastSurname;
                    element.MenteeName = element.MenteeFirstName + " " + element.MenteeLastSurname;
                }, this);
                relationships = relationshipsObj.value;
            }                
            dispatch(loadRelationshipsByCampusIDSuccess(relationships));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadRelationshipByMentorAndMenteeSuccess(relationship) {
    return { type: types.LOAD_RELATIONSHIP_BY_MENTOR_AND_MENTEE_SUCCESS, relationship };
}

export function loadRelationshipByMentorAndMentee(mentorEmployeeID, menteeEmployeeID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getRelationshipsByMentorAndMentee(mentorEmployeeID, menteeEmployeeID, timeConfigurationID).then(relationshipsObj => {
            let relationship = {};
            if(relationshipsObj.value && relationshipsObj.value.length > 0){
                relationship = relationshipsObj.value[0];
                relationship.MentorName = relationship.MentorFirstName + " " + relationship.MentorLastSurname;
                relationship.MenteeName = relationship.MenteeFirstName + " " + relationship.MenteeLastSurname;
            }
            dispatch(loadRelationshipByMentorAndMenteeSuccess(relationship));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadRelationshipByIDSuccess(relationship) {
    return { type: types.LOAD_RELATIONSHIP_BY_ID_SUCCESS, relationship };
}

export function loadRelationshipByID(relationshipID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getRelationshipByID(relationshipID).then(relationshipsObj => {
            let relationship = {};
            if(relationshipsObj.value && relationshipsObj.value.length > 0){
                relationship = relationshipsObj.value[0];
                relationship.MentorName = relationship.MentorFirstName + " " + relationship.MentorLastSurname;
                relationship.MenteeName = relationship.MenteeFirstName + " " + relationship.MenteeLastSurname;
            }
            dispatch(loadRelationshipByIDSuccess(relationship));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createRelationship(relationship) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.createRelationship(relationship).then(response => {
            dispatch(createRelationshipSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createRelationshipSuccess(relationship) {
    return { type: types.CREATE_RELATIONSHIP_SUCCESS, relationship };
}

export function deleteRelationship(relationshipID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.deleteRelationship(relationshipID).then((response) => {
            dispatch(deleteRelationshipSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteRelationshipSuccess() {
    return { type: types.DELETE_RELATIONSHIP_SUCCESS };
}

export function createRelationshipRequest(relationship) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharePointApi.createRelationshipRequest(relationship).then(response => {
            dispatch(createRelationshipRequestSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createRelationshipRequestSuccess(relationship) {
    return { type: types.CREATE_RELATIONSHIP_REQUEST_SUCCESS, relationship };
}
