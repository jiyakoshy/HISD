import * as types from './actionTypes';
import MentorsMenteesApi from '../api/mentorsMenteesApi';
import RelationshipsApi from '../api/relationshipsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadMenteesByCampusSuccess(mentees) {
    return { type: types.LOAD_MENTEES_BY_CAMPUS_SUCCESS, mentees};
}

export function loadMenteesByCampus(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MentorsMenteesApi.getMenteesByCampus(campusID).then(mentees => {
            mentees.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            });
            dispatch(loadMenteesByCampusSuccess(mentees.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllMenteesSuccess(mentees) {
    return { type: types.LOAD_ALL_MENTEES_SUCCESS, mentees};
}

export function loadAllMentees() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MentorsMenteesApi.getAllMentees().then(mentees => {
            mentees.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            }); 
            dispatch(loadAllMenteesSuccess(Utilities.arrayFlattener(mentees.value)));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadMenteesInActiveRelationshipsByMentorIDSuccess(mentees) {
    return { type: types.LOAD_MENTEES_IN_RELATIONSHIP_BY_MENTORID_SUCCESS, mentees};
}

export function loadMenteesInActiveRelationshipsByMentorID(employeeID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMenteesInActiveRelationshipsByMentorID(employeeID, timeConfigurationID).then(mentees => {
            mentees.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            });
            dispatch(loadMenteesInActiveRelationshipsByMentorIDSuccess(mentees.value));
        }).catch(error => {
            throw (error);
        });
    };
}