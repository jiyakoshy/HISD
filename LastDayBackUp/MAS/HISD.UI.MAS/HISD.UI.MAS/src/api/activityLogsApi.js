import Config from './config';

class ActivityLogsApi {

    //admin dashboard 

    static getAllActivityLogHoursMonthly(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + '/odata/GetAllActivityLogs?$select=ActivityLogID,Duration,NameOfInstitution,EducationOrgNaturalKey,ActivityStartTime&$expand=Mentees($count=true)';
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getAllActivityLogs() {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + '/odata/GetAllActivityLogs?$expand=Mentees,ActivityToolItems,ActivityStandardItems&$orderby=ActivityLogID';
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getActivityLogsByCampusID(campusID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + campusID + "')?$filter=TimeConfigurationID eq " + timeConfigurationID + "&$orderby=MentorLastSurname&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getActivityLogsByMenteeID(menteeEmployeeID, timeConfigurationID) {
        // menteeEmployeeID = '20240'; //'8909';
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetActivityLogsByMenteeID(EmployeeID='" + menteeEmployeeID + "')?$filter=TimeConfigurationID eq " + timeConfigurationID + "&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getActivityLogByID(activityLogID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllActivityLogs?$filter=ActivityLogID eq " + activityLogID + "&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getActivityLogCountByMentorPerMonth(mentorID, month, year) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/ActivityLogs?$filter=MentorEmployeeID eq '" + mentorID + "' and month(CreateDate) eq " + month + " and year(CreateDate) eq " + year + "";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static createActivityLog(activityLog) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/CreateActivityLogs";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(activityLog),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static updateActivityLog(activityLog) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/UpdateActivityLogs";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                body: JSON.stringify(activityLog),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static deleteActivityLog(activityLogID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllActivityLogs(" + activityLogID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getActivityLogMenteeByID(menteeEmployeeID, activityLogID, activityLogMenteeID) {
        menteeEmployeeID = '20240'; //'8909';
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetActivityLogsByMenteeID(EmployeeID='" + menteeEmployeeID + "')?$expand=Mentees($filter=ActivityLogMenteeID eq " + activityLogMenteeID + "),ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static updateActivityLogMentee(activityLogMentee) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/ActivityLogs(" + activityLogMentee.ActivityLogID + ")/ActivityLog_Mentees(" + activityLogMentee.ActivityLogMenteeID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(activityLogMentee),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getMentorAllActivityLogsByMonth(timeConfigurationID, campusID, mentorID, stDate, edDate){
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentorAllActivityLogsByMonth(TimeConfigurationID="+timeConfigurationID+",CampusID='"+campusID+"',MentorId='"+mentorID+"',CurrentMonthStDate='"+stDate+"',CurrentMonthEdDate='"+edDate+"')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

}

export default ActivityLogsApi;
