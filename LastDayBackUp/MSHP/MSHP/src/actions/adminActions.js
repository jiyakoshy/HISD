import * as types from './actionTypes';
import AdminApi from '../api/adminApi';
import {updateUserHomePageSuccess} from '../actions/sharedActions';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';

export function loadAllTimeConfigs() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllTimeConfigs().then(timeConfigs => {
            dispatch(loadAllTimeConfigsSuccess(timeConfigs.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllTimeConfigsSuccess(timeConfigs) {
    return { type: types.LOAD_ALL_TIME_CONFIGS_SUCCESS, timeConfigs };
}

export function loadTimeConfig(timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getTimeConfig(timeConfigurationID).then(timeConfig => {
            dispatch(loadTimeConfigSuccess(timeConfig));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadTimeConfigSuccess(timeConfig) {
    return { type: types.LOAD_TIME_CONFIG_SUCCESS, timeConfig };
}

export function loadCurrentTimeConfig() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getCurrentTimeConfig().then(timeConfig => {
            dispatch(loadCurrentTimeConfigSuccess(timeConfig));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCurrentTimeConfigSuccess(timeConfig) {
    return { type: types.LOAD_CURRENT_TIME_CONFIG_SUCCESS, timeConfig };
}

export function loadTimeConfigBySchoolYear(schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getTimeConfigBySchoolYear(schoolYear).then(timeConfigObj => {
            let timeConfig = {};
            if(timeConfigObj.value && timeConfigObj.value.length > 0)
                timeConfig = timeConfigObj.value[0];
            dispatch(loadTimeConfigBySchoolYearSuccess(timeConfig));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadTimeConfigBySchoolYearSuccess(timeConfig) {
    return { type: types.LOAD_TIME_CONFIG_BY_SCHOOL_YEAR_SUCCESS, timeConfig };
}

export function createTimeConfig(timeConfig) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createTimeConfig(timeConfig).then(response => {
            dispatch(createTimeConfigSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createTimeConfigSuccess(timeConfig) {
    return { type: types.CREATE_TIME_CONFIG_SUCCESS, timeConfig };
}

export function updateTimeConfig(timeConfig) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateTimeConfig(timeConfig).then(response => {
            dispatch(updateTimeConfigSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateTimeConfigSuccess(timeConfig) {
    return { type: types.UPDATE_TIME_CONFIG_SUCCESS, timeConfig };
}

export function deleteTimeConfig(timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteTimeConfig(timeConfigurationID).then((response) => {
            dispatch(deleteTimeConfigSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteTimeConfigSuccess() {
    return { type: types.DELETE_TIME_CONFIG_SUCCESS };
}

export function loadAllActivityCodes() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllActivityCodes().then(activityCodes => {
            dispatch(loadAllActivityCodesSuccess(activityCodes.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllActivityCodesSuccess(activityCodes) {
    return { type: types.LOAD_ALL_ACTIVITY_CODES_SUCCESS, activityCodes };
}

export function loadActivityCodeSuccess(activityCode) {
    return { type: types.LOAD_ACTIVITY_CODE_SUCCESS, activityCode };
}

export function loadActivityCode(activityCodeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getActivityCode(activityCodeID).then(activityCode => {
            dispatch(loadActivityCodeSuccess(activityCode));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActivityCodeByNameSuccess(activityCode) {
    return { type: types.LOAD_ACTIVITY_CODE_BY_NAME_SUCCESS, activityCode };
}

export function loadActivityCodeByName(activityCodeName) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getActivityCodeByName(activityCodeName).then(activityCodeObj => {
            let activityCode = {};
            if(activityCodeObj.value && activityCodeObj.value.length > 0)
                activityCode = activityCodeObj.value[0];
            dispatch(loadActivityCodeByNameSuccess(activityCode));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateActivityCode(activityCode) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateActivityCode(activityCode).then(response => {
            dispatch(updateActivityCodeSuccess(activityCode));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateActivityCodeSuccess(activityCode) {
    return { type: types.UPDATE_ACTIVITY_CODE_SUCCESS, activityCode };
}

export function createActivityCode(activityCode) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createActivityCode(activityCode).then(response => {
            dispatch(createActivityCodeSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createActivityCodeSuccess(activityCode) {
    return { type: types.CREATE_ACTIVITY_CODE_SUCCESS, activityCode };
}

export function deleteActivityCode(activityCodeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteActivityCode(activityCodeID).then(() => {
            dispatch(deleteActivityCodeSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteActivityCodeSuccess() {
    return { type: types.DELETE_ACTIVITY_CODE_SUCCESS };
}

export function loadAllCBMStandards() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllCBMStandards().then(cbmStandards => {
            cbmStandards.value.forEach(function(element) {
                element.MonthName = Utilities.getMonthName(element.Month);
            }, this);
            dispatch(loadAllCBMStandardsSuccess(cbmStandards.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllCBMStandardsSuccess(cbmStandards) {
    return { type: types.LOAD_ALL_CBM_STANDARDS_SUCCESS, cbmStandards };
}

export function loadCBMStandard(cbmStandardID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getCBMStandard(cbmStandardID).then(cbmStandard => {
            cbmStandard.MonthName = Utilities.getMonthName(cbmStandard.Month);
            dispatch(loadCBMStandardSuccess(cbmStandard));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCBMStandardSuccess(cbmStandard) {
    return { type: types.LOAD_CBM_STANDARD_SUCCESS, cbmStandard };
}

export function updateCBMStandard(cbmStandard) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateCBMStandard(cbmStandard).then(cbmStandard => {
            dispatch(updateCBMStandardSuccess(cbmStandard));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateCBMStandardSuccess(cbmStandard) {
    return { type: types.UPDATE_CBM_STANDARD_SUCCESS, cbmStandard };
}

export function loadAllMentoringTools() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllMentoringTools().then(mentoringTools => {
            dispatch(loadAllMentoringToolsSuccess(mentoringTools.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllMentoringToolsSuccess(mentoringTools) {
    return { type: types.LOAD_ALL_MENTORING_TOOLS_SUCCESS, mentoringTools };
}

export function loadAllActivityStandards() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllActivityStandards().then(activityStandards => {
            dispatch(loadAllActivityStandardsSuccess(activityStandards.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllActivityStandardsSuccess(activityStandards) {
    return { type: types.LOAD_ALL_ACTIVITY_STANDARDS_SUCCESS, activityStandards };
}

export function loadAllHomeMessages() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllHomeMessages().then(homeMessagesObj => {
            let homeMessages = [];
            $.each(homeMessagesObj.value, function (key,obj) {
                let newObj = {};
                newObj.HomeMessageID = obj.HomeMessageID;
                newObj.HomeMessageRole = obj.HomeMessageRole;
                newObj.StartDate = new Date(Utilities.getDateTime(obj.StartDate));
                newObj.EndDate = new Date(Utilities.getDateTime(obj.EndDate));
                newObj.HomeMessageContent = obj.HomeMessageContent;
                homeMessages.push(newObj);
            });
            dispatch(loadAllHomeMessagesSuccess(homeMessages));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllHomeMessagesSuccess(homeMessages) {
    return { type: types.LOAD_ALL_HOME_MESSAGES_SUCCESS, homeMessages };
}

export function loadHomeMessage(homeMessageID) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getHomeMessage(homeMessageID).then(homeMessageObj => {
            let homeMessage = {};
            homeMessage.HomeMessageID = homeMessageObj.HomeMessageID;
            homeMessage.HomeMessageRole = homeMessageObj.HomeMessageRole;
            homeMessage.StartDate = new Date(Utilities.getDateTime(homeMessageObj.StartDate));
            homeMessage.EndDate = new Date(Utilities.getDateTime(homeMessageObj.EndDate));
            homeMessage.HomeMessageContent = homeMessageObj.HomeMessageContent;
            dispatch(loadHomeMessageSuccess(homeMessage));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadHomeMessageSuccess(homeMessage) {
    return { type: types.LOAD_HOME_MESSAGE_SUCCESS, homeMessage };
}

export function loadHomeMessageByRole(role) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getHomeMessageByRole(role).then(homeMessage => {
            dispatch(loadHomeMessageSuccess(homeMessage));
            const newHomePage = {type: homeMessage.HomeMessageRole, content: homeMessage.HomeMessageContent};
            dispatch(updateUserHomePageSuccess(newHomePage));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadHomeMessageByRoleSuccess(homeMessage) {
    return { type: types.LOAD_HOME_MESSAGE_BY_ROLE_SUCCESS, homeMessage };
}

export function loadHomeMessageByRoleWithoutDates(role) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getHomeMessageByRoleWithoutDates(role).then(homeMessage => {
            dispatch(loadHomeMessageByRoleWithoutDatesSuccess(homeMessage));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadHomeMessageByRoleWithoutDatesSuccess(homeMessage) {
    return { type: types.LOAD_HOME_MESSAGE_BY_ROLE_WITHOUT_DATES_SUCCESS, homeMessage };
}

export function updateHomeMessage(homeMessage) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateHomeMessage(homeMessage).then(response => {
            dispatch(updateHomeMessageSuccess(homeMessage));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateHomeMessageSuccess(homeMessage) {
    return { type: types.UPDATE_HOME_MESSAGE_SUCCESS, homeMessage };
}

export function createHomeMessage(homeMessage) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createHomeMessage(homeMessage).then(response => {
            dispatch(createHomeMessageSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createHomeMessageSuccess(homeMessage) {
    return { type: types.CREATE_HOME_MESSAGE_SUCCESS, homeMessage };
}

export function deleteHomeMessage(homeMessageID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteHomeMessage(homeMessageID).then(() => {
            dispatch(deleteHomeMessageSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteHomeMessageSuccess() {
    return { type: types.DELETE_HOME_MESSAGE_SUCCESS };
}

export function loadAllSiteContents() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllSiteContents().then(siteContents => {
            dispatch(loadAllSiteContentsSuccess(siteContents.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllSiteContentsSuccess(siteContents) {
    return { type: types.LOAD_ALL_SITE_CONTENTS_SUCCESS, siteContents };
}

export function loadSiteContent(siteContentID) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getSiteContent(siteContentID).then(siteContent => {
            dispatch(loadSiteContentSuccess(siteContent));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadSiteContentSuccess(siteContent) {
    return { type: types.LOAD_SITE_CONTENT_SUCCESS, siteContent };
}


export function loadSiteContentByCode(code) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getSiteContentByCode(code).then(siteContent => {
            dispatch(loadSiteContentByCodeSuccess(siteContent));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadSiteContentByCodeSuccess(siteContent) {
    return { type: types.LOAD_SITE_CONTENT_BY_CODE_SUCCESS, siteContent };
}

export function updateSiteContent(siteContent) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateSiteContent(siteContent).then(response => {
            dispatch(updateSiteContentSuccess(siteContent));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateSiteContentSuccess(siteContent) {
    return { type: types.UPDATE_SITE_CONTENT_SUCCESS, siteContent };
}

export function createSiteContent(siteContent) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createSiteContent(siteContent).then(response => {
            dispatch(createSiteContentSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createSiteContentSuccess(siteContent) {
    return { type: types.CREATE_SITE_CONTENT_SUCCESS, siteContent };
}

export function deleteSiteContent(siteContentID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteSiteContent(siteContentID).then(() => {
            dispatch(deleteSiteContentSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteSiteContentSuccess() {
    return { type: types.DELETE_SITE_CONTENT_SUCCESS };
}

export function loadAllCampusContacts() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllCampusContacts().then(campusContacts => {
            $.each(campusContacts.value, function (key,obj) {
                obj.ContactName = obj.FirstName + " " + obj.LastSurname;
            });
            dispatch(loadAllCampusContactsSuccess(campusContacts.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllCampusContactsSuccess(campusContacts) {
    return { type: types.LOAD_ALL_CAMPUS_CONTACTS_SUCCESS, campusContacts };
}

export function loadCampusContactsByCampusID(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getCampusContactsByCampusID(campusID).then(campusContacts => {
            $.each(campusContacts.value, function (key,obj) {
                obj.ContactName = obj.FirstName + " " + obj.LastSurname;
            });
            dispatch(loadCampusContactsByCampusIDSuccess(campusContacts.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCampusContactsByCampusIDSuccess(campusContacts) {
    return { type: types.LOAD_CAMPUS_CONTACTS_BY_CAMPUSID_SUCCESS, campusContacts };
}

export function loadCampusContactByCampusIDAndEmployeeID(campusID, employeeID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getCampusContactByCampusIDAndEmployeeID(campusID, employeeID, timeConfigurationID).then(campusContactObj => {
            let campusContact = {};
            if(campusContactObj.value.length > 0)
                campusContact = campusContactObj.value[0];
            dispatch(loadCampusContactByCampusIDAndEmployeeIDSuccess(campusContact));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCampusContactByCampusIDAndEmployeeIDSuccess(campusContact) {
    return { type: types.LOAD_CAMPUS_CONTACT_BY_CAMPUSID_AND_EMPLOYEEID_SUCCESS, campusContact };
}

export function createCampusContact(campusContact) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createCampusContact(campusContact).then(response => {
            dispatch(createCampusContactSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createCampusContactSuccess(campusContact) {
    return { type: types.CREATE_CAMPUS_CONTACT_SUCCESS, campusContact };
}

export function updateCampusContact(campusContact) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateCampusContact(campusContact).then(response => {
            dispatch(updateCampusContactSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateCampusContactSuccess(campusContact) {
    return { type: types.UPDATE_CAMPUS_CONTACT_SUCCESS, campusContact };
}

export function deleteCampusContact(campusContactID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteCampusContact(campusContactID).then(() => {
            dispatch(deleteCampusContactSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteCampusContactSuccess() {
    return { type: types.DELETE_CAMPUS_CONTACT_SUCCESS };
}

export function loadAllMenteesEndDates() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getAllMenteesEndDates().then(menteesEndDates => {
            $.each(menteesEndDates.value, function (key,obj) {
                obj.MenteeName = obj.FirstName + " " + obj.LastSurname;
            });
            dispatch(loadAllMenteesEndDatesSuccess(menteesEndDates.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllMenteesEndDatesSuccess(menteesEndDates) {
    return { type: types.LOAD_ALL_MENTEES_ENDDATES_SUCCESS, menteesEndDates };
}

export function loadMenteesEndDatesByCampusID(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getMenteesEndDatesByCampusID(campusID).then(menteesEndDates => {
            $.each(menteesEndDates.value, function (key,obj) {
                obj.MenteeName = obj.FirstName + " " + obj.LastSurname;
            });
            dispatch(loadMenteesEndDatesByCampusIDSuccess(menteesEndDates.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadMenteesEndDatesByCampusIDSuccess(menteesEndDates) {
    return { type: types.LOAD_MENTEES_ENDDATES_BY_CAMPUSID_SUCCESS, menteesEndDates };
}

export function loadMenteeEndDateByEmployeeID(employeeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getMenteeEndDateByEmployeeID(employeeID).then(menteeEndDateObj => {
            let menteeEndDate = {};
            if(menteeEndDateObj.value.length > 0)
                menteeEndDate = menteeEndDateObj.value[0];

            dispatch(loadMenteeEndDateByEmployeeIDSuccess(menteeEndDate));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadMenteeEndDateByEmployeeIDSuccess(menteeEndDate) {
    return { type: types.LOAD_MENTEE_ENDDATE_BY_EMPLOYEEID_SUCCESS, menteeEndDate };
}

export function createMenteeEndDate(menteeEndDate) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createMenteeEndDate(menteeEndDate).then(response => {
            dispatch(createMenteeEndDateSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createMenteeEndDateSuccess(menteeEndDate) {
    return { type: types.CREATE_MENTEE_ENDDATE_SUCCESS, menteeEndDate };
}

export function updateMenteeEndDate(menteeEndDate) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateMenteeEndDate(menteeEndDate).then(response => {
            dispatch(updateMenteeEndDateSuccess(menteeEndDate));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateMenteeEndDateSuccess(menteeEndDate) {
    return { type: types.UPDATE_MENTEE_ENDDATE_SUCCESS, menteeEndDate };
}

export function deleteMenteeEndDate(menteeEndDateID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteMenteeEndDate(menteeEndDateID).then(() => {
            dispatch(deleteMenteeEndDateSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteMenteeEndDateSuccess() {
    return { type: types.DELETE_MENTEE_ENDDATE_SUCCESS };
}

export function loadVerificationCode() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getVerificationCode().then(verificationCodeObj => {
            let verificationCode = {};
            if(verificationCodeObj && verificationCodeObj.value.length > 0)
            verificationCode = verificationCodeObj.value[0];
            dispatch(loadVerificationCodeSuccess(verificationCode));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadVerificationCodeSuccess(verificationCode) {
    return { type: types.LOAD_VERIFICATION_CODE_BY_PARENT_CODE_SUCCESS, verificationCode };
}

export function loadVerificationCodeDetails(multiChoiceListItemID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getVerificationCodeDetails(multiChoiceListItemID).then(verificationCodeDetails => {
            dispatch(loadVerificationCodeDetailsSuccess(verificationCodeDetails));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadVerificationCodeDetailsSuccess(verificationCodeDetails) {
    return { type: types.LOAD_VERIFICATION_CODE_DETAILS_SUCCESS, verificationCodeDetails };
}


export function createVerificationCodeDetails(verificationCodeDetails) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.createVerificationCodeDetails(verificationCodeDetails).then(response => {
            dispatch(createVerificationCodeDetailsSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createVerificationCodeDetailsSuccess(verificationCodeDetails) {
    return { type: types.CREATE_VERIFICATION_CODE_DETAILS_SUCCESS, verificationCodeDetails };
}

export function updateVerificationCodeDetails(multiChoiceListItemID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.updateVerificationCodeDetails(multiChoiceListItemID).then(verificationCodeDetails => {
            dispatch(updateVerificationCodeDetailsSuccess(verificationCodeDetails));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateVerificationCodeDetailsSuccess(verificationCodeDetails) {
    return { type: types.UPDATE_VERIFICATION_CODE_DETAILS_SUCCESS, verificationCodeDetails };
}

export function deleteVerificationCodeDetails(multiChoiceListItemID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.deleteVerificationCodeDetails(multiChoiceListItemID).then(() => {
            dispatch(deleteVerificationCodeDetailsSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteVerificationCodeDetailsSuccess() {
    return { type: types.DELETE_VERIFICATION_CODE_DETAILS_SUCCESS };
}

export function loadAllCampusGradeLevels(campusID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return AdminApi.getCampusGradeLevelsByCampusCurrentYear(campusID).then(campusGradeLevels => {
            dispatch(loadAllCampusGradeLevelsSuccess(campusGradeLevels.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllCampusGradeLevelsSuccess(campusGradeLevels) {
    return { type: types.LOAD_ALL_CAMPUS_GRADE_LEVELS_SUCCESS, campusGradeLevels };
}

export function loadCampusProfileIDForState(campusID, schoolYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall()); 
        return AdminApi.getCampusProfileIDForState(campusID, schoolYear).then(profileIDObj => {
            let campusProfileID = 0;
            if(profileIDObj)
                campusProfileID = profileIDObj;

            dispatch(loadCampusProfileIDForStateSuccess(campusProfileID));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCampusProfileIDForStateSuccess(campusProfileID) {
    return { type: types.LOAD_CAMPUS_PROFILE_ID_SUCCESS, campusProfileID };
}
