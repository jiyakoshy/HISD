import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import enrollmentApi from '../api/enrollmentApi';
import adminApi from '../api/adminApi';
import React from 'react';

export function loadAllEnrollmentsByYearCampus(campusID, schoolYear) {
    return function (dispatch) {
    dispatch(beginAjaxCall());
   return enrollmentApi.getEnrollments(campusID, schoolYear).then( enrollmentsObj => {
        let enrollments = [];
        let foundWaiver = false;
        $.each( enrollmentsObj, function (key, obj) {
         let newEnrollment = {};
         foundWaiver = false;
         if(obj.Calendar){//required to have related Calendar so Plannotes can be checked
             if (obj.Calendar.PlanNotes) {
                 if (obj.Calendar.PlanNotes !== null) {
                    if (obj.Calendar.PlanNotes !== ''){
                        let plannotes = obj.Calendar.PlanNotes.toLowerCase();
                        if (plannotes.search('waiver') > -1) foundWaiver = true; //abandons the record by continuing loop
                    }
                 }
             }
         }

         if(!foundWaiver) {
                if (obj.Calendar.ReportDate) {
                newEnrollment.ReportDate = Utilities.getDateOnly(new Date(Utilities.getDateTime(obj.Calendar.ReportDate)));
                }

                if (obj.Calendar.InstructionDay) {
                    newEnrollment.InstructionDay = (obj.Calendar.InstructionDay !== null) ? obj.Calendar.InstructionDay : 0;
                }

                if (obj.Calendar.CompareDaySeq) {
                    newEnrollment.CompareDaySeq = (obj.Calendar.CompareDaySeq !== null) ? obj.Calendar.CompareDaySeq : 0;
                }
            
                newEnrollment.CampusProfileID = (obj.CampusProfileId !== null) ? obj.CampusProfileId  : 0;
                newEnrollment.CampusEnrollmentID = (obj.Id !== null) ? obj.Id  : 0;
                newEnrollment.CalendarID =  (obj.CalendarId !== null) ? obj.CalendarId  : 0;
                newEnrollment.UpdatedBy = (obj.UpdatedBy !== null) ? obj.UpdatedBy : '';
                newEnrollment.CreatedBy = (obj.CreatedBy !== null) ? obj.CreatedBy : '';
                newEnrollment.IEE = (obj.IEE !== null) ? obj.IEE : 0;
                newEnrollment.IPK = (obj.IPK !== null) ? obj.IPK : 0;
                newEnrollment.IKG = (obj.IKG !== null) ? obj.IKG : 0; 
                newEnrollment.I01 = (obj.I01 !== null) ? obj.I01 : 0;
                newEnrollment.I02 = (obj.I02 !== null) ? obj.I02 : 0;
                newEnrollment.I03 = (obj.I03 !== null) ? obj.I03 : 0;
                newEnrollment.I04 = (obj.I04 !== null) ? obj.I04 : 0;
                newEnrollment.I05 = (obj.I05 !== null) ? obj.I05 : 0;
                newEnrollment.I06 = (obj.I06 !== null) ? obj.I06 : 0;
                newEnrollment.I07 = (obj.I07 !== null) ? obj.I07 : 0;
                newEnrollment.I08 = (obj.I08 !== null) ? obj.I08 : 0;
                newEnrollment.I09 = (obj.I09 !== null) ? obj.I09 : 0;
                newEnrollment.I10 = (obj.I10 !== null) ? obj.I10 : 0;
                newEnrollment.I11 = (obj.I11 !== null) ? obj.I11 : 0;
                newEnrollment.I12 = (obj.I12 !== null) ? obj.I12 : 0;
                newEnrollment.Total = (obj.Total !== null) ? obj.Total : 0;
                newEnrollment.CreatedDate = (obj.CreatedDate !== null) ?  obj.CreatedDate  : new Date(Utilities.getDateTime(obj.CreatedDate));
                newEnrollment.UpdatedDate = (obj.UpdatedDate !== null)  ? obj.UpdatedDate  : new Date(Utilities.getDateTime(obj.UpdatedDate));
                enrollments.push(newEnrollment);
            }

        });
            dispatch(loadEnrollmentsByCampusSuccess(enrollments));
            }).catch(error => {
                throw (error);
        });
    };
}
export function loadEnrollmentsByCampusSuccess(enrollments) {
    return { type: types.LOAD_ENROLLMENTS_BY_CAMPUS_SUCCESS, enrollments};
}

export function clearEnrollments() {
    const enrollments = [];
    return { type: types.CLEAR_ENROLLMENTS_DATA_SUCCESS, enrollments};
}

export function updateEnrollment(enrollment) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return adminApi.updateEnrollment(enrollment).then(response => {
            dispatch(updateEnrollmentSuccess(enrollment));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateEnrollmentSuccess(enrollment) {
    return { type: types.UPDATE_ENROLLMENT_SUCCESS, enrollment };
}

export function createCampusEnrollment(enrollment) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return adminApi.createCampusEnrollment(enrollment).then(response => {
            dispatch(createCampusEnrollmentSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createCampusEnrollmentSuccess(enrollment) {
    return { type: types.CREATE_CAMPUS_ENROLLMENT_SUCCESS, enrollment };
}