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
// by_RR: method to service call for Mentor Profile 
export function loadMentorProfileByEmployeeIDSuccess(mentor) {
    return { type: types.LOAD_MENTORPROFILE_BY_EMPLOYEEID_SUCCESS, mentor};
}

export function loadMentorProfileByEmployeeID(employeeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MentorsMenteesApi.getMentorProfileByEmployeeID(employeeID).then(mentorObj => {
            let mentorInfo = {};
            mentorInfo.MentorName = mentorObj.FirstName + ' ' + mentorObj.LastSurname;
            mentorInfo.EmailAddress = mentorObj.StaffElectronicEmail.ElectronicMailAddress.toLowerCase();
            mentorInfo.Department = mentorObj.EducationOrganization.NameOfInstitution;
            mentorInfo.OneSourceTitle = mentorObj.JobCode.JobCodeDescription;
            mentorInfo.EmployeeID = mentorObj.StaffNaturalKey;
            dispatch(loadMentorProfileByEmployeeIDSuccess(mentorInfo));
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
// by_RR: Load mentors with an active relationship and timeconfig
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

// by_RR: Load mentors with an active relationship and no timeconfig
export function loadMentorsInActiveRelationshipsByCampusIDSuccess(mentors) {
    return { type: types.LOAD_MENTORS_IN_RELATIONSHIP_BY_CAMPUS_SUCCESS, mentors};
}

export function loadMentorsInActiveRelationshipsByCampusID(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMentorsInActiveRelationshipsByCampusID(campusID).then(mentors => {
            mentors.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            }); 
            dispatch(loadMentorsInActiveRelationshipsByCampusIDSuccess(mentors.value));
        }).catch(error => {
            throw (error);
        });
    };
}

// by Mentor Profile by campusID and EmployeeID 
export function loadMentorProfileByEmployeeIDandCampusIDSuccess(mentor) {
    return { type: types.LOAD_MENTORPROFILE_BY_EMPLOYEEIDANDCAMPUSID_SUCCESS, mentor};
}

export function loadMentorProfileByEmployeeIDandCampusID(mentorEmpID,campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMentorProfileByEmployeeIDandCampusID(mentorEmpID,campusID).then(mentorObj => {
            dispatch(loadMentorProfileByEmployeeIDandCampusIDSuccess(mentorObj));
        }).catch(error => {
            throw (error);
        });
    };
}


