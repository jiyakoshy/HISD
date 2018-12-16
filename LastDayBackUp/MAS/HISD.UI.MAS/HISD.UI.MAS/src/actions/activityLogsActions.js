import * as types from './actionTypes';
import ActivityLogsApi from '../api/activityLogsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import ActionHelperMethods from  './actionHelperMethods';

//admin Dashboard
export function loadAllActivityLogHoursMonthlySuccess(activityLog) {
    return { type: types.LOAD_ALL_ACTIVITY_LOGHOURSMONTHLY_SUCCESS, activityLog };
}
export function loadAllActivityLogHoursMonthly(timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getAllActivityLogHoursMonthly(timeConfigurationID).then(activityLogsObj => {
            let minutesCount = 0;
            let totalCount = 0;
            let activitiesHourSummary = {};
            activitiesHourSummary.totalMinutesCount = 0;
            if (activityLogsObj.value && activityLogsObj.value.length > 0) {
                for (let i = 0; i < activityLogsObj.value.length; i++) {
                    minutesCount += parseInt(activityLogsObj.value[i].Duration);
                }
            }
            activitiesHourSummary.totalMinutesCount = minutesCount;
            dispatch(loadAllActivityLogHoursMonthlySuccess(activitiesHourSummary));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllActivityLogs() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getAllActivityLogs().then(activityLogs => {
            dispatch(loadAllActivityLogsSuccess(activityLogs.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllActivityLogsSuccess(activityLogs) {
    return { type: types.LOAD_ALL_ACTIVITY_LOGS_SUCCESS, activityLogs };
}

export function loadActivityLogentorCountPerMonth(mentorID, month, year) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getActivityLogCountByMentorPerMonth(mentorID, month, year).then(activityLogs => {

            if (activityLogs.value.length > 0) {

                dispatch(loadActivityLogentorCountPerMonthSuccess(activityLogs.value.length.toString()));
            }

        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActivityLogentorCountPerMonthSuccess(activityLogMentorCountPerMonth) {
    return { type: types.LOAD_ACTIVITY_LOG_MENTOR_COUNT_PER_MONTH_SUCCESS, activityLogMentorCountPerMonth };
}

export function loadActivityLogsByCampusID(campusID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getActivityLogsByCampusID(campusID, timeConfigurationID).then(activityLogsObj => {
            dispatch(loadActivityLogsByCampusIDSuccess(activityLogsObj.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActivityLogsByCampusIDSuccess(activityLogs) {
    return { type: types.LOAD_ACTIVITY_LOGS_BY_CAMPUSID_SUCCESS, activityLogs };
}

export function loadActivityLogsByMenteeID(menteeEmployeeID, timeConfigurationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getActivityLogsByMenteeID(menteeEmployeeID, timeConfigurationID).then(activityLogsObj => {
            let activityLogsMentee = [];
            $.each(activityLogsObj.value, function (key, obj) {
                if (obj.Mentees && obj.Mentees.length > 0) {
                    let activityLog = {};
                    activityLog.ActivityLogMenteeID = obj.Mentees[0].ActivityLogMenteeID;
                    activityLog.ActivityLogID = obj.ActivityLogID;
                    activityLog.MentorName = obj.MentorName;
                    activityLog.ActivityCodeName = obj.ActivityCodeName;
                    activityLog.ActivityCodeDescription = obj.ActivityCodeDescription;
                    activityLog.ActivityStartTime = obj.ActivityStartTime;
                    activityLog.Duration = obj.Duration;
                    activityLog.MenteeName = obj.Mentees[0].MenteeName;
                    activityLog.MenteeComments = obj.Mentees[0].MenteeComments;
                    activityLog.VerificationCommentItemID = obj.Mentees[0].VerificationCommentItemID;
                    activityLog.VerificationCommentDescription = obj.Mentees[0].VerificationCommentDescription;
                    activityLog.VerificationCommentCode = obj.Mentees[0].VerificationCommentCode;
                    activityLog.VerificationStatus = obj.Mentees[0].VerificationStatus;
                    activityLogsMentee.push(activityLog);
                }
            });
            dispatch(loadActivityLogsByMenteeIDSuccess(activityLogsMentee));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActivityLogsByMenteeIDSuccess(activityLogsMentee) {
    return { type: types.LOAD_ACTIVITY_LOGS_BY_MENTEEID_SUCCESS, activityLogsMentee };
}


export function loadActivityLogByID(activityLogID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getActivityLogByID(activityLogID).then(activityLogsObj => {
            let activityLog = {};
            if (activityLogsObj.value && activityLogsObj.value.length > 0)
                activityLog = activityLogsObj.value[0];
            activityLog.MentorName = activityLogsObj.value[0].MentorFirstName + ' ' + activityLogsObj.value[0].MentorLastSurname;
            activityLog.TimeSpent = Utilities.getTimeSpent(activityLogsObj.value[0].Duration);
            activityLog.MenteeNames = getMentees(activityLog.Mentees);
            dispatch(loadActivityLogByIDSuccess(activityLog));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActivityLogByIDSuccess(activityLog) {
    return { type: types.LOAD_ACTIVITY_LOG_BY_ID_SUCCESS, activityLog };
}

function getMentees(menteesArray) {
    if (menteesArray == undefined || menteesArray.length == 0) return "";
    let mentees = "";
    let count = menteesArray.length;
    for (let i = 0; i < count; i++) {
        if (mentees == "")
            mentees = menteesArray[i].FirstName + " " + menteesArray[i].LastSurname + " (" + menteesArray[i].VerificationStatus + ")";
        else
            mentees += "; " + menteesArray[i].FirstName + " " + menteesArray[i].LastSurname + " (" + menteesArray[i].VerificationStatus + ")";
    }
    return mentees;
}

function getActivityStandards(activityStandardsArray) {
    if (activityStandardsArray.length == 0) return "";
    let activtyStandards = "";
    let count = activityStandardsArray.length;
    for (let i = 0; i < count; i++) {
        if (activtyStandards == "")
            activtyStandards = activityStandardsArray[i].ActivityStandardItemName;
        else
            activtyStandards += "<br />" + activityStandardsArray[i].ActivityStandardItemName;
    }
    return activtyStandards;
}

function getActivityTools(activityToolsArray) {
    if (activityToolsArray.length == 0) return "";
    let activityTools = "";
    let count = activityToolsArray.length;
    for (let i = 0; i < count; i++) {
        if (activityTools == "")
            activityTools = activityToolsArray[i].ActivityToolItemName;
        else
            activityTools += "<br />" + activityToolsArray[i].ActivityToolItemName;
    }
    return activityTools;
}

export function createActivityLog(activityLog) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.createActivityLog(activityLog).then(activityLog => {
            dispatch(createActivityLogSuccess(activityLog));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createActivityLogSuccess(activityLog) {
    return { type: types.CREATE_ACTIVITY_LOG_SUCCESS, activityLog };
}

export function updateActivityLog(activityLog) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.updateActivityLog(activityLog).then(activityLog => {
            dispatch(updateActivityLogSuccess(activityLog));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateActivityLogSuccess(activityLog) {
    return { type: types.UPDATE_ACTIVITY_LOG_SUCCESS, activityLog };
}

export function deleteActivityLog(activityLogID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.deleteActivityLog(activityLogID).then(() => {
            dispatch(deleteActivityLogSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteActivityLogSuccess() {
    return { type: types.DELETE_ACTIVITY_LOG_SUCCESS };
}

export function clearActivityLog() {
    const activityLog = {};
    return { type: types.CLEAR_ACTIVITY_LOG_SUCCESS, activityLog };
}

export function loadActivityLogMenteeByID(menteeEmployeeID, activityLogID, activityLogMenteeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.getActivityLogMenteeByID(menteeEmployeeID, activityLogID, activityLogMenteeID).then(activityLogsObj => {
            let activityLogMentee = {};
            $.each(activityLogsObj.value, function (key, obj) {
                if (obj.Mentees && obj.Mentees.length > 0) {
                    activityLogMentee.ActivityLogMenteeID = obj.Mentees[0].ActivityLogMenteeID;
                    activityLogMentee.ActivityLogID = obj.ActivityLogID;
                    activityLogMentee.MentorName = obj.MentorName;
                    activityLogMentee.MenteeName = obj.Mentees[0].MenteeName;
                    activityLogMentee.ActivityCodeName = obj.ActivityCodeName;
                    activityLogMentee.ActivityCodeDescription = obj.ActivityCodeDescription;
                    activityLogMentee.ActivityStartTime = obj.ActivityStartTime;
                    activityLogMentee.Duration = obj.Duration;
                    activityLogMentee.VerificationCommentItemID = obj.Mentees[0].VerificationCommentItemID;
                    activityLogMentee.VerificationCommentDescription = obj.Mentees[0].VerificationCommentDescription;
                    activityLogMentee.VerificationCommentCode = obj.Mentees[0].VerificationCommentCode;
                    activityLogMentee.VerificationStatus = obj.Mentees[0].VerificationStatus;
                    activityLogMentee.MenteeComments = obj.Mentees[0].MenteeComments;
                }
            });
            dispatch(loadActivityLogMenteeByIDSuccess(activityLogMentee));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActivityLogMenteeByIDSuccess(activityLogMentee) {
    return { type: types.LOAD_ACTIVITY_LOG_MENTEE_BY_ID_SUCCESS, activityLogMentee };
}

export function updateActivityLogMentee(activityLogMentee) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return ActivityLogsApi.updateActivityLogMentee(activityLogMentee).then(activityLogMentee => {
            dispatch(updateActivityLogMenteeSuccess(activityLogMentee));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateActivityLogMenteeSuccess(activityLogMentee) {
    return { type: types.UPDATE_ACTIVITY_LOG_MENTEE_SUCCESS, activityLogMentee };
}

export function loadMentorAllActivityLogsByMonth(timeConfigurationID, campusID, mentorID, firstDay, lastDay){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        let mentorActivityLogs = []
        return ActivityLogsApi.getMentorAllActivityLogsByMonth(timeConfigurationID, campusID, mentorID, firstDay, lastDay).then(items =>{
            if(items.value && items.value.length > 0){
                return ActionHelperMethods.getMentorName(items).then(res =>{
                    return ActionHelperMethods.getMenteeName(items).then(res1 =>{
                        mentorActivityLogs = res1;
                        dispatch(loadActivityLogsByCampusIDSuccess(mentorActivityLogs.value));
                    });
                }); 
            }else{
                dispatch(loadActivityLogsByCampusIDSuccess(mentorActivityLogs.value));
            }
        }).catch(error =>{
            throw (error);
        });        
    };
}
    
