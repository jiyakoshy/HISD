import * as types from './actionTypes';
import CampusApi from '../api/campusApi';
import CustomWaiversApi from '../api/customWaiversApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadAllCampusesSuccess(campuses) {
    return { type: types.LOAD_ALL_CAMPUSES_SUCCESS, campuses};
}

export function loadAllSchoolSuccess(schools) {
    return { type: types.LOAD_ALL_SCHOOLS_SUCCESS, schools};
}

export function loadAllWaiversSuccess(waivers) {
    return { type: types.LOAD_ALL_WAIVERS_SUCCESS, waivers };
}

export function loadAllSavedWaiversSuccess(savedWaivers) {
    return { type: types.LOAD_ALL_SAVED_WAIVERS_SUCCESS, savedWaivers };
}

export function saveSchoolDetailsSuccess(data) {
    return { type: types.SAVE_SCHOOL_DETAILS_SUCCESS, data };
}

export function clearAction(){
    return {type : types.CLEAR_ACTION};
}

export function handleSelectedWaivers(data){
    return { type: types.HANDLE_SELECTED_WAIVERS, data };
}

export function saveStatusActionSuccess(data){
    return { type: types.SAVE_STATUS, data };
}

export function saveSchoolTypeSuccess(data){
    return { type : types.SCHOOL_TYPE_SUCCESS, data};
}

export function loadAllCustomWaiversSuccess(data){
    return { type : types.LOAD_ALL_CUSTOM_WAIVER_SUCCESS, data};
}

export function saveStatusAction(startYear, campusID){
    return function (dispatch) {
        return CampusApi.getSchooolStatusAPI(startYear,campusID).then(item => {
           dispatch(saveStatusActionSuccess(item.value));
      }).catch(error => {
          throw (error);
      });
    };   
}

export function saveWaiversAction(payload,campusDetails){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.addWaiversAPI(payload).then(data => {
            const {campusNumber, startYear} = campusDetails;
            dispatch(loadAllWaivers(campusNumber, startYear));
            dispatch(saveStatusAction(startYear, campusNumber));
      }).catch(error => {
          throw (error);
      });
    };
}

export function savePatchWaiversAction(payload,campusDetails){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.updateWaiversAPI(payload).then(data => {
            const {campusNumber, startYear} = campusDetails;
            dispatch(loadAllWaivers(campusNumber, startYear));
            dispatch(saveStatusAction(startYear, campusNumber));
      }).catch(error => {
          throw (error);
      });
    };
}

export function saveSelectedWaiver(data,schoolStartYear,schoolEndYear){
    const isAlreadySavedWaiver = data.hasOwnProperty('SchoolWaiverDeleted');
    if(isAlreadySavedWaiver){
        const patchPayload = Utilities.getPatchPayload(data,schoolStartYear,schoolEndYear);
        const schoolWaiverId = data.SchoolWaiverID;
        this.updateWaivers(schoolWaiverId,patchPayload);
    }else{
        const postPayload = Utilities.getPostPayload(data,schoolStartYear,schoolEndYear);
        addWaivers(postPayload);
    }
}

export function updateWaivers(schoolWaiverId,patchPayload){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.updateWaiversAPI(schoolWaiverId,patchPayload).then(data => {
           
      }).catch(error => {
          throw (error);
      });
    };
}


export function addWaivers(postPayload) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.addWaiversAPI(postPayload).then(data => {
           
        }).catch(error => {
            throw (error);
        });
    };
}
export function updateAllActions(schoolId, currentYear, campusDetails) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCampusTypes(schoolId,currentYear).then(type => {
            if(type.value === "HS"){
                dispatch(highSchoolEndPoint(currentYear));
            }else if(type.value === "MS"){
                dispatch(middleSchoolEndPoint(currentYear));
            }else if(type.value === "ES"){
                dispatch(elementarySchoolEndPoint(currentYear));
            }
           const { ID, campusName } = campusDetails;
           dispatch(loadAllSavedWaivers(schoolId, currentYear));
           dispatch(loadAllCustomWaivers(ID,currentYear));
           dispatch(saveStatusAction(currentYear,schoolId));
           dispatch(saveSchoolDetailsSuccess({ID, campusName}));
           dispatch(saveSchoolTypeSuccess(type.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllWaivers(schoolId, currentYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCampusTypes(schoolId,currentYear).then(type => {
            if(type.value === "HS"){
                dispatch(highSchoolEndPoint(currentYear));
            }else if(type.value === "MS"){
                dispatch(middleSchoolEndPoint(currentYear));
            }else if(type.value === "ES"){
                dispatch(elementarySchoolEndPoint(currentYear));
            }
            dispatch(saveSchoolTypeSuccess(type.value));  
        }).catch(error => {
            throw (error);
        });
    };
}

export function highSchoolEndPoint(year) {
    return function (dispatch) {
      return CampusApi.getHighSchoolDetails(year).then(data => {
          dispatch(loadAllWaiversSuccess(data.value));
    }).catch(error => {
        throw (error);
    });
  };
}


export function elementarySchoolEndPoint(year) {
    return function (dispatch) {
      return CampusApi.getElementarySchoolDetails(year).then(data => {
          dispatch(loadAllWaiversSuccess(data.value));
    }).catch(error => {
        throw (error);
    });
  };
}

export function middleSchoolEndPoint(year) {
    return function (dispatch) {
      return CampusApi.getMiddleSchoolDetails(year).then(data => {
          dispatch(loadAllWaiversSuccess(data.value));
    }).catch(error => {
        throw (error);
    });
  };
}

export function loadAllSavedWaivers(schoolId, currentYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getSavedSchoolWaivers(schoolId,currentYear).then(data => {
            dispatch(loadAllSavedWaiversSuccess(data.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllCustomWaivers(campusNumber, currentYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.getCustomWaiversAPI(campusNumber,currentYear).then(data => {
            dispatch(loadAllCustomWaiversSuccess(data.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function addCustomWaiverAction(data,campusDetails){
    const payload = Utilities.customWaiverPayload(data, campusDetails);
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.addCustomWaiverAPI(payload).then(data => {
            const {campusNumber, startYear} = campusDetails;
            dispatch(loadAllWaivers(campusNumber, startYear));
            dispatch(saveStatusAction(startYear, campusNumber));
      }).catch(error => {
          throw (error);
      });
    };
}

export function updateCustomWaiver(data){
    const { wavierId } = data;
    const payload = Utilities.updateSchoolCustomWaiverPayload(data);
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.updatedCustomWaiverAPI(payload, wavierId).then(data => {
      }).catch(error => {
          throw (error);
      });
    };
}

export function deleteCustomWaiverAction(schoolWaiverId, schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CampusApi.deleteCustomWaivers(schoolWaiverId).then(data => {
        }).catch(error => {
            throw (error);
        });
    };
}

export function resetSchoolWaiversAction(startYear, campusNumber){
    return function (dispatch){
        dispatch(beginAjaxCall());
        return CampusApi.resetSchoolWaivers(startYear, campusNumber).then(data =>{

        }).catch(error => {
            throw (error);
        });
    };
}