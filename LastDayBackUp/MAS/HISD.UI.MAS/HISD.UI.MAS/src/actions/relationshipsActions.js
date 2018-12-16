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
            if (relationshipsObj.value && relationshipsObj.value.length > 0) {
                relationshipsObj.value.forEach(function (element) {
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
            if (relationshipsObj.value && relationshipsObj.value.length > 0) {
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
            if (relationshipsObj.value && relationshipsObj.value.length > 0) {
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
export function updateRelationship(relationship) {
   return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.updateRelationship(relationship).then(response => {
            dispatch(updateRelationshipSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateRelationshipSuccess(relationship) {
    return { type: types.UPDATE_RELATIONSHIP_SUCCESS, relationship };
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

export function updateRelationshipRequest(relationship) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return SharePointApi.updateRelationshipRequest(relationship).then(response => {
            dispatch(updateRelationshipRequestSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateRelationshipRequestSuccess(taskID){
    return { type: types.GET_TASK_ID_SUCCESS, taskID };
}

export function loadTopRelationshipsCampuses(TimeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getop3RelationshipsCampues(TimeConfigurationID).then(response => {
            if(response.value.length >0)
            {
                response.value.map( e=>{
                  e.keyValue =   e.RelationShipCount;
                  e.key = e.Campus;
                });
            }
            dispatch(loadTopRelationshipsCampusesSuccess(response.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadTopRelationshipsCampusesSuccess(topCampusesOnRelationShip) {
    return { type: types.LOAD_TOPRELATIONSHIPSCAMPUSES_SUCCESS, topCampusesOnRelationShip };
}
//LOAD_ALLRELATIONSHIPSSTATUSSUMMARY_SUCCESS
export function loadAllRelationshipsCountByStatusSuccess(relationship) {
    return { type: types.LOAD_ALLRELATIONSHIPSCOUNTBYSTATUS_SUCCESS, relationship };
}
export function loadAllRelationshipsCountByStatus(timeConfigurationID, campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        console.log('jo--1--');
        return RelationshipsApi.getRelationshipsCountByStatus(timeConfigurationID, campusID).then(response => {
            let relationship = {};
            relationship = response.value[0];
            dispatch(loadAllRelationshipsCountByStatusSuccess(relationship));
            console.log('jo--2--');
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllMentorAgreementSuccess(data) {
    return { type: types.LOAD_ALL_MENTOR_AGREEMENT_SUCCESS, data };
}

export function getMentorAgreementDetails(timeConfigurationID) {
    return function (dispatch) {
        return RelationshipsApi.getMentorAgreementDetailsAPI(timeConfigurationID).then(response => {
            dispatch(loadAllMentorAgreementSuccess(response.value[0]));
        }).catch(error => {
            throw (error);
        });
    };
}
