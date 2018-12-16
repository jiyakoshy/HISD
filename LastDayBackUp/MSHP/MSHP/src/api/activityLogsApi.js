import Config from './config';

class ActivityLogsApi {

    static getAllActivityLogs() {
        let serviceUrl = Config.REST_URL + 'MAS/odata/ActivityLogs?$orderby=ActivityLogID';
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetActivityLogsByCampusID(CampusID='" + campusID + "')?$filter=TimeConfigurationID eq " + timeConfigurationID + "&$orderby=MentorLastSurname&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        menteeEmployeeID = '8909';
        let serviceUrl = Config.REST_URL + "MAS/odata/GetActivityLogsByMenteeID(EmployeeID='" + menteeEmployeeID + "')?$filter=TimeConfigurationID eq " + timeConfigurationID + "&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllActivityLogs?$filter=ActivityLogID eq " + activityLogID + "&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        let serviceUrl = Config.REST_URL + "MAS/odata/CreateActivityLogs";
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
        let serviceUrl = Config.REST_URL + "MAS/odata/UpdateActivityLogs";
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllActivityLogs(" + activityLogID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
            .then(function (response) {
                if(response.ok == true)
                    resolve(response);
                else{
                    reject(response.statusText);
                }
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static getActivityLogMenteeByID(menteeEmployeeID, activityLogID, activityLogMenteeID) {
        menteeEmployeeID = '8909';
        let serviceUrl = Config.REST_URL + "MAS/odata/GetActivityLogsByMenteeID(EmployeeID='" + menteeEmployeeID + "')?$expand=Mentees($filter=ActivityLogMenteeID eq " + activityLogMenteeID + "),ActivityToolItems,ActivityStandardItems";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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

    static updateActityLogMentee(activityLogMentee) {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityLogs(" + activityLogMentee.ActivityLogID + ")/ActivityLog_Mentees(" + activityLogMentee.ActivityLogMenteeID + ")";
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
    
}

export default ActivityLogsApi;
