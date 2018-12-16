import * as types from './actionTypes';
import CampusApi from '../api/campusApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadAllCampusesSuccess(campuses) {
    return { type: types.LOAD_ALL_CAMPUSES_SUCCESS, campuses};
}

export function loadAllCampuses() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getAllCampuses().then(campuses => {
            dispatch(loadAllCampusesSuccess(campuses.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCampusesByManagerSuccess(campuses) {
    return { type: types.LOAD_CAMPUSES_BY_MANAGER_SUCCESS, campuses};
}

export function loadCampusesByManager(managerStaffNaturalKey) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCampusesByManager(managerStaffNaturalKey).then(employee => {
            let campuses = [];
            employee.SchoolManagers.forEach(function(item) {
                campuses.push(item.EducationOrganization);
            });
            dispatch(loadCampusesByManagerSuccess(campuses));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllCSOSuccess(csoStaffs) {
    return { type: types.LOAD_ALLCSO_SUCCESS, csoStaffs};
}

export function loadAllCSO() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getAllCSO().then(csoStaffsObj => {
            /*let csoStaffs = [];
            $.each(csoStaffsObj.value, function (key,obj) {
                if(obj.Up2Manager && obj.Up2Manager.length > 0){
                    let csoStaff = {};
                    csoStaff.Up2ManagerStaffNaturalKey = obj.Up2ManagerStaffNaturalKey;
                    csoStaff.EducationOrgNaturalKey = obj.EducationOrgNaturalKey;
                    csoStaff.CSOName = obj.Up2Manager[0].FirstName +" " + obj.Up2Manager[0].LastSurname;
                    csoStaffs.push(csoStaff);
                }
            });*/
            dispatch(loadAllCSOSuccess(csoStaffsObj.value));
             
             
             
             
             /* Older Version
             let csoStaffs = [];
             if(csoStaffsObj.value && csoStaffsObj.value.length > 0){
                csoStaffsObj.value.forEach(function(element) {
                    element.Up2ManagerStaffNaturalKey = element.Up2ManagerStaffNaturalKey;
                    element.EducationOrgNaturalKey = element.EducationOrgNaturalKey;
                    element.CSOName = element.Up2Manager[0].FirstName + " " + element.Up2Manager[0].FirstName;
                    
                }, this);
                csoStaffs = csoStaffsObj.value;
            }               
            dispatch(loadAllCSOSuccess(csoStaffs));*/

        }).catch(error => {
            throw (error);
        });
    };
}
