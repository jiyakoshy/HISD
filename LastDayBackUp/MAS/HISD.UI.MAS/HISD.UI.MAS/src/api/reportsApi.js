import Config from './config';

class ReportsApi {
    static getDemographicReport(params) {

        let serviceUrl = Config.REST_URL;
        if (params.SchoolID == 'All' || params.SchoolID == '')
            serviceUrl += Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$filter=(CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")";
        else
            serviceUrl += Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$filter=(EducationOrgNaturalKey eq '" + params.SchoolID + "' and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + "))";
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

    static getMenteeActivityLogsCompletionReport(params) {

        //debugger;
        let serviceUrl = Config.REST_URL;
        if (params.SchoolID == 'All' || params.SchoolID == '')
            serviceUrl += Config.SERVICESTART + "/odata/GetAllActivityLogs?$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        else {
            if (params.MentorEmployeeID === 'All' || params.MentorEmployeeID === '')
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            else {
                if (params.MenteeEmployeeID === 'All' || params.MenteeEmployeeID === '')
                    serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "')&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
                else
                    //serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
                    serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByMenteeID(EmployeeID='" + params.MenteeEmployeeID + "')?$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            }

        }
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

    static getMentorActivityLogReport(params) {
        let serviceUrl = Config.REST_URL;
        if (params.SchoolID == 'All' || params.SchoolID == '')
            serviceUrl += Config.SERVICESTART + "/odata/GetAllActivityLogs?$filter=(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        else {
            /*if(params.MentorEmployeeID === 'All' || params.MentorEmployeeID === '')
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            else
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";*/
            if (params.MentorEmployeeID === 'All' || params.MentorEmployeeID === '')
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            else {
                if (params.MenteeEmployeeID === 'All' || params.MenteeEmployeeID === '')
                    serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
                else
                    //serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
                    serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByMenteeID(EmployeeID='" + params.MenteeEmployeeID + "')?$filter=(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            }
        }

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

    static getVerificationStandardsAndToolsReport(params) {
        let serviceUrl = Config.REST_URL;
        if (params.SchoolID == 'All' || params.SchoolID == '')
            serviceUrl += Config.SERVICESTART + "/odata/GetAllActivityLogs?$filter=(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        else {
            /*if(params.MentorEmployeeID === 'All' || params.MentorEmployeeID === '')
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            else
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";*/

            if (params.MentorEmployeeID === 'All' || params.MentorEmployeeID === '')
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            else {
                if (params.MenteeEmployeeID === 'All' || params.MenteeEmployeeID === '')
                    serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
                else
                    //serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
                    serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByMenteeID(EmployeeID='" + params.MenteeEmployeeID + "')?$filter=(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            }
        }
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

    static getActivityTotalReport(params) {
        let serviceUrl = Config.REST_URL;
        if (params.CSOEmployeeID == 'All' || params.CSOEmployeeID == '')
            serviceUrl += Config.SERVICESTART + "/odata/GetAllActivityLogs?$apply=filter(ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")/groupby((ActivityLogID,CSOEmployeeID,CSOFirstName,CSOLastSurname,EducationOrgNaturalKey,NameOfInstitution,ActivityCodeID,ActivityCodeName),aggregate(Duration with sum as TotalDuration))&$orderby=CSOEmployeeID";
        else {
            if (params.SchoolID === 'All' || params.SchoolID === '')
                serviceUrl += Config.SERVICESTART + "/odata/GetAllActivityLogs?$apply=filter(CSOEmployeeID eq '" + params.CSOEmployeeID + "' and ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")/groupby((ActivityLogID,CSOEmployeeID,CSOFirstName,CSOLastSurname,EducationOrgNaturalKey,NameOfInstitution,ActivityCodeID,ActivityCodeName),aggregate(Duration with sum as TotalDuration))&$orderby=CSOEmployeeID";
            else
                serviceUrl += Config.SERVICESTART + "/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$apply=filter(CSOEmployeeID eq '" + params.CSOEmployeeID + "' and ActivityStartTime gt " + params.StartDate + " and ActivityStartTime lt " + params.EndDate + ")/groupby((ActivityLogID,CSOEmployeeID,CSOFirstName,CSOLastSurname,EducationOrgNaturalKey,NameOfInstitution,ActivityCodeID,ActivityCodeName),aggregate(Duration with sum as TotalDuration))&$orderby=CSOEmployeeID";
        }
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

export default ReportsApi;
