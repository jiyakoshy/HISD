import * as types from './actionTypes';
import StaffApi from '../api/staffApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadStaffByEmployeeIDSuccess(staff) {
    return { type: types.LOAD_STAFF_BY_EMPLOYEEID_SUCCESS, staff};
}

export function loadStaffByEmployeeID(employeeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return StaffApi.getStaffByEmployeeID(employeeID).then(staff => {
            staff.forEach(function(element) {
                if(element.StaffElectronicEmail.ElectronicEmailAddress)
                    element.ElectronicMailAddress = element.StaffElectronicEmail.ElectronicEmailAddress;
            }, this);
            dispatch(loadStaffByEmployeeIDSuccess(staff));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadStaffsByCampusIDSuccess(staffs) {
    return { type: types.LOAD_STAFFS_BY_CAMPUSID_SUCCESS, staffs};
}

export function loadAllMenteeActivitiesSuccess(data) {
    return { type: types.LOAD_ALL_MENTEE_ACTIVITY_SUCCESS, data};
}

export function loadStaffsByCampusID(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return StaffApi.getStaffsByCampusID(campusID).then(staffs => {
            staffs.value.forEach(function(element) {
                if(element.StaffElectronicEmail.ElectronicMailAddress)
                    element.ElectronicMailAddress = element.StaffElectronicEmail.ElectronicMailAddress;
            }, this);
            dispatch(loadStaffsByCampusIDSuccess(staffs.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllMenteeActivities(campusID, timeConfigID, staffs, startDate, endDate) {
    return function (dispatch) {
        return StaffApi.getMenteeActivitiesAPI(campusID,timeConfigID, startDate, endDate).then(item => {
            const activitiesObj = {activityList : item.value, staffList : staffs}
            dispatch(loadAllMenteeActivitiesSuccess(activitiesObj));
        }).catch(error => {
            throw (error);
        });
    };
}