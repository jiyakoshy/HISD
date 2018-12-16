import { Map, fromJS } from 'immutable';
import Utilities from '../../utilities/utilities';
import _ from 'lodash';

//Finding School Name and School Status.....
export const fetchSchoolList = (state, action) => {
    const schoolStatus = action.schools;
    const getCampusDetails = state.campusesDropDownList;
    const schoolArrList = [];
    getCampusDetails.map((list) => {
        const tempObj = {};
        const findSchoolName = schoolStatus && Utilities.filteredArray(schoolStatus, 'CampusNumber', list.OrganizationCode)
        if (findSchoolName) {
            tempObj.OrganizationCode = list.OrganizationCode;
            tempObj.WaiverStatusID = Utilities.getStatus(findSchoolName.WaiverStatusID) || 'invalid status';
            tempObj.NameOfInstitution = list.NameOfInstitution;
        } else {
            tempObj.OrganizationCode = list.OrganizationCode;
            tempObj.WaiverStatusID = Utilities.getStatus(1);
            tempObj.NameOfInstitution = list.NameOfInstitution;
        }
        schoolArrList.push(tempObj);
    });
    return { ...state, schoolDetails: schoolArrList, finalSchoolDetails: schoolArrList }
}

export const getSchoolDetails = (state, action) => {
    const getSchoolList = state.finalSchoolDetails;
    const selectedSchoolId = action.campus.key;
    const getDetails = getSchoolList && Utilities.filteredArray(getSchoolList, 'OrganizationCode', selectedSchoolId)
    if (getDetails) {
        return { ...state, schoolDetails: [getDetails] }
    }

    return { ...state };
}

//Getting Current School Year......
export const getUserCurrentYear = (state, action) => {
    const startYear = action.details.value[0].Description.slice(0, 4);
    const endYear = action.details.value[0].Description.slice(5, 9);
    return { ...state, userStartYear: startYear, userEndYear: endYear }
}

//Loading Waivers(General and Custom) for SchoolStatus is 'Saved' or 'Submitted'.....
export const updateWaiverDetails = (state, action) => {
    const savedWaivers = action.savedWaivers;
    const getWaiverList = state.waiversList;
    const generalWaivers = [];
    const customWaivers = [];
    const allWaivers = getWaiverList.concat(savedWaivers);
    const output = [...((new Map(allWaivers.map((item) => [item.WaiverID, item]))).values())];
    output.forEach(item => {
        if (item.WaiverTypeID === 2) {
            customWaivers.push(item);
        } else {
            generalWaivers.push(item);
        }
    });
    generalWaivers.sort((a, b) => a.WaiverName > b.WaiverName);
    customWaivers.sort((a, b) => a.WaiverName > b.WaiverName);
    return {
        ...state,
        savedWaiversList: generalWaivers,
        customWaiversList: customWaivers
    }
}

//Post selected Waivers....
export const updateWaiverList = (state, action) => {
    let waiverListArr = state.waiversCheckList;
    const { endYear, selectedRow, startYear, schoolStatus, campusNumber, isChecked } = action.data;
    const postPayload = Utilities.getPostPayload(selectedRow, startYear, endYear, schoolStatus, campusNumber);
    if (!isChecked) {
        _.remove(waiverListArr, { WaiverID: postPayload.WaiverID });
    }
    isChecked && waiverListArr.push(postPayload);
    return { waiversCheckList: waiverListArr }
}

//Get School Status is: 'Not Started', 'Saved', and 'Submitted'......
export const getWaiversStatus = (state, action) => {
    const statusObj = action.data;
    let schoolStatus;
    if (!_.isEmpty(statusObj)) {
        const statusID = statusObj[0].WaiverStatusID
        schoolStatus = Utilities.getStatus(statusID);
    } else {
        schoolStatus = Utilities.getStatus(1);
    }
    return { ...state, status: schoolStatus };
}

//Get WaiversSetting Dates(Application Administration)......
export const updateWaiversSetting = (state, action) => {
    const settings = action.settings;
    if (settings.length > 0) {
        return {
            ...state,
            EnrollmentStartDate: settings[0].EnrollmentStartDate,
            EnrollmentEndDate: settings[0].EnrollmentEndDate,
            EnrollmentStartTime: settings[0].EnrollmentStartTime,
            EnrollmentEndTime: settings[0].EnrollmentEndTime,
            isPost: false,
            settingsID: settings[0].WaiverSettingID,
            isCopyWaiver: settings[0].SchoolWaiverCopyStatus || false
        }
    }
    return { ...state, settingsID: '', isCopyWaiver: false, isPost: true, EnrollmentStartDate: '', EnrollmentEndDate: '', EnrollmentStartTime: '', EnrollmentEndTime: '' }
}


export const fetchCustomWaviersDetails = (state, action) =>{
    const getCampusDetails = state.campusesDropDownList;
    const customWaiversList = action.data;
    const customArrList = [];
    customWaiversList.map((list) => {
        const tempObj = {};
        const campusName = customWaiversList && Utilities.filteredArray(getCampusDetails, 'OrganizationCode', list.CampusNumber);
        tempObj.SchoolWaiverID = list.SchoolWaiverID;
        tempObj.WaiverName = list.WaiverName;
        tempObj.WaiverDescription = list.WaiverDescription;
        tempObj.WaiverID = list.WaiverID;
        tempObj.ReportType = list.ReportType;
        tempObj.ReportTypeID = list.ReportTypeID;
        tempObj.CustomApprovalStatus = list.CustomApprovalStatus;
        tempObj.WaiverAdministrationID = list.WaiverAdministrationID;
        tempObj.Elementary = list.Elementary;
        tempObj.Middle = list.Middle;
        tempObj.High = list.High;
        tempObj.WaiverCreatedDate = list.WaiverCreatedDate;
        tempObj.WaiverAdminCreatedDate = list.WaiverAdminCreatedDate;
        tempObj.NameOfInstitution = campusName && campusName.NameOfInstitution || 'N.A';
        tempObj.CampusNumber = list.CampusNumber;
        customArrList.push(tempObj);
    });

    return {...state, waviersList: customArrList }
}

export const fetchWaviersRequestDetails = (state, action) =>{
    const getCampusDetails = state.campusesDropDownList;
    const requestFormList = action.details;
    const requestArrList = [];
    requestFormList.map((list) => {
        const tempObj = {};
        const campusName = requestFormList && Utilities.filteredArray(getCampusDetails, 'OrganizationCode', list.CampusNumber);
        if(!_.isEmpty(campusName)){
            tempObj.SchoolWaiverID = list.SchoolWaiverID;
            tempObj.NameOfInstitution = campusName.NameOfInstitution || 'N.A';
            tempObj.CampusNumber = list.CampusNumber;
            tempObj.WaiverStatus = list.WaiverStatusID;
            tempObj.WaiverStatusID = Utilities.getStatus(list.WaiverStatusID) || 'invalid status';
            requestArrList.push(tempObj);
        }
        
    });

    return {...state, requestFormList: requestArrList }
}

export const fetchAddWaviersRequestDetails = (state, action) => {
    const requestFormList = action.details.list;
    const type = action.details.requestType === "custom";
    const requestArrList = [];
    const customWaivers =  state.get('customWaivers').toJS();
    requestFormList.map((list) => {
        const tempObj = {};
        tempObj.SchoolWaiverID = list.SchoolWaiverID;
        tempObj.WaiverName = list.WaiverName;
        tempObj.WaiverDescription = list.WaiverDescription;
        requestArrList.push(tempObj);        
    });
    
    const flatteredArr =  type && requestArrList.concat(customWaivers) || requestArrList;
    return state.set('list', fromJS(flatteredArr));
}

export const fetchUp1ManagersDetails = (state, action) =>{
    const details = action.data;
    const ssoDetailsObj = Utilities.getManagersObj(details,'Up1Manager');
   
    return {...state, ssoDetails: ssoDetailsObj };
}

export const fetchUp2ManagersDetails = (state, action) =>{
    const details = action.data;
    const supDetailsObj = Utilities.getManagersObj(details,'Up2Manager');
   
    return {...state, supDetails: supDetailsObj };
}

export const removeRequestList = (state, action) => {
    const prevState = state.get('list').toJS();
    _.remove(prevState, { SchoolWaiverID: action.waiverID });
    return state.set('list', fromJS(prevState));
}

