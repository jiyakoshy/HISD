import * as types from './actionTypes';
import MentorsMenteesApi from '../api/mentorsMenteesApi';
import RelationshipsApi from '../api/relationshipsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadMentorsByCampusSuccess(mentors) {
    return { type: types.LOAD_MENTORS_BY_CAMPUS_SUCCESS, mentors};
}

export function loadMentorsByCampus(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MentorsMenteesApi.getMentorsByCampus(campusID).then(mentors => {
            mentors.value.forEach(function(element) {
                if(element.StaffElectronicEmail.ElectronicMailAddress)
                    element.ElectronicMailAddress = element.StaffElectronicEmail.ElectronicMailAddress;
                if(element.JobFunction.JobFunctionDescription)
                    element.JobFunctionDescription = element.JobFunction.JobFunctionDescription;
                element.FullName = element.FirstName + " " + element.LastSurname;
                    
            }, this);
            dispatch(loadMentorsByCampusSuccess(mentors.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllMentorsSuccess(mentors) {
    return { type: types.LOAD_ALL_MENTORS_SUCCESS, mentors};
}

export function loadAllMentors() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MentorsMenteesApi.getAllMentors().then(mentors => {
            mentors.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            });            
            dispatch(loadAllMentorsSuccess(mentors.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadMentorsInRelationshipsByCampusIDSuccess(mentors) {
    return { type: types.LOAD_MENTORS_IN_RELATIONSHIP_BY_CAMPUS_SUCCESS, mentors};
}

export function loadMentorsInRelationshipsByCampusID(campusID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMentorsInRelationshipsByCampusID(campusID, timeConfigurationID).then(mentors => {
            mentors.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            }); 
            dispatch(loadMentorsInRelationshipsByCampusIDSuccess(mentors.value));
        }).catch(error => {
            throw (error);
        });
    };
}