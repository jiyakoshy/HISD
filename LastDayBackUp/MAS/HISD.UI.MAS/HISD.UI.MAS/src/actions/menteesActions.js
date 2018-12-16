import * as types from './actionTypes';
import MentorsMenteesApi from '../api/mentorsMenteesApi';
import RelationshipsApi from '../api/relationshipsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadMenteesByCampusSuccess(mentees) {
    return { type: types.LOAD_MENTEES_BY_CAMPUS_SUCCESS, mentees};
}

export function loadAlreadyExistMenteesByCampusSuccess(mentees) {
    return { type: types.LOAD_ALREADY_ADDED_MENTEES_BY_CAMPUS_SUCCESS, mentees};
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

export function loadAlreadyExistMenteesByCampus(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MentorsMenteesApi.getAlreadyAddedMenteesByCampus(campusID).then(mentees => {
            dispatch(loadAlreadyExistMenteesByCampusSuccess(mentees.value));
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
// by_RR: Load mentors with an active relationship and with timeconfig
export function loadMenteesInActiveRelationshipsByCampusIDSuccess(mentees) {
    return { type: types.LOAD_MENTEES_IN_RELATIONSHIP_BY_CAMPUS_SUCCESS, mentees};
}

export function loadMenteesInActiveRelationshipsByCampusID(campusID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMenteesInActiveRelationshipsByCampusID(campusID, timeConfigurationID).then(mentees => {
            mentees.value.forEach(function(element) {
                element.FullName = element.FirstName + " " + element.LastSurname;
            }); 
            dispatch(loadMenteesInActiveRelationshipsByCampusIDSuccess(mentees.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadMenteesInActiveRelationshipsByMentorIDSuccess(mentees) {
    return { type: types.LOAD_MENTEES_IN_RELATIONSHIP_BY_MENTORID_SUCCESS, mentees};
}

export function loadMenteesInActiveRelationshipsByMentorID(employeeID, timeConfigurationID, campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMenteesInActiveRelationshipsByMentorID(employeeID, timeConfigurationID,campusID).then(mentees => {
            mentees.value.map(e =>{
             e.FullName=  e.LastSurname +","+ e.FirstName;
            })
            dispatch(loadMenteesInActiveRelationshipsByMentorIDSuccess(mentees.value));
        }).catch(error => {
            throw (error);
        });
    };
}

// load a specific Mentee Relationship Profile details 
export function loadMenteeRelationshipProfileByEmployeeIDSuccess(mentee) {
    return { type: types.LOAD_MENTEERELATIONSHIPPROFILE_BY_EMPLOYEEID_SUCCESS, mentee};
}

export function loadMenteeRelationshipProfileByEmployeeID(employeeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return RelationshipsApi.getMenteeRelationshipProfileByEmployeeID(employeeID).then(menteeRelationshipObj => {
            let menteeRelationshipInfo = {};
            if(menteeRelationshipObj.value && menteeRelationshipObj.value.length > 0){
                menteeRelationshipInfo = menteeRelationshipObj.value[0];
                menteeRelationshipInfo.MenteeEmployeeID = menteeRelationshipInfo.MenteeEmployeeID;
                menteeRelationshipInfo.MenteeName = menteeRelationshipInfo.MenteeFirstName + ' ' + menteeRelationshipInfo.MenteeLastSurname;
                menteeRelationshipInfo.MenteeEmailAddress = menteeRelationshipInfo.MenteeElectronicMailAddress.toLowerCase();
                menteeRelationshipInfo.Department = menteeRelationshipInfo.NameOfInstitution;
                menteeRelationshipInfo.MenteeOneSourceTitle = menteeRelationshipInfo.MenteeJobCodeDescription;
                menteeRelationshipInfo.MenteeACP = menteeRelationshipInfo.MenteeACP;
                menteeRelationshipInfo.MenteeCertificationStatus = menteeRelationshipInfo.MenteeCertificationStatus;
                //menteeRelationshipInfo.MenteeEndDateInRelationship = menteeObj.MenteeEndDateInRelationship;
                
                //mentor related
                menteeRelationshipInfo.MetnorName =  menteeRelationshipInfo.MentorFirstName + ' ' + menteeRelationshipInfo.MentorLastSurname;
                menteeRelationshipInfo.MentorEmailAddress = menteeRelationshipInfo.MentorElectronicMailAddress.toLowerCase();
                menteeRelationshipInfo.MentorAgreement = menteeRelationshipInfo.MentorAgreement;
                
                //Metnor-Mentee Relationship related
                menteeRelationshipInfo.MentorMenteeRelationshipID = menteeRelationshipInfo.MentorMenteeRelationshipID;
                menteeRelationshipInfo.TimeConfigurationID = menteeRelationshipInfo.TimeConfigurationID;
                //menteeRelationshipInfo.RelationshipStartDate = menteeObj.RelationshipStartDate;
                //menteeRelationshipInfo.RelationshipEndDate = menteeObj.RelationshipEndDate;
            }
            dispatch(loadMenteeRelationshipProfileByEmployeeIDSuccess(menteeRelationshipInfo));
        }).catch(error => {
            throw (error);
        });
    };
}
