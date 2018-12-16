import Config from './config';

class ReportsApi {
    static getDemographicReport(params) {

        let serviceUrl = Config.REST_URL;
        if(params.SchoolID == 'All' || params.SchoolID == '')
            serviceUrl += "MAS/odata/GetAllMentorMenteeRelationships?$filter=(CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")";
        else
            serviceUrl +=  "MAS/odata/GetAllMentorMenteeRelationships?$filter=(EducationOrgNaturalKey eq '" + params.SchoolID + "' and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + "))";
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

    static getMentorActivityLogReport(params) {

        let serviceUrl = Config.REST_URL;
        if(params.SchoolID == 'All' || params.SchoolID == '')
            serviceUrl += "MAS/odata/GetAllActivityLogs?$filter=(CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        else{
            if(params.MentorEmployeeID === 'All' || params.MentorEmployeeID === '')
                serviceUrl += "MAS/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
            else
                serviceUrl += "MAS/odata/GetActivityLogsByCampusID(CampusID='" + params.SchoolID + "')?$filter=(MentorEmployeeID eq '" + params.MentorEmployeeID + "') and (CreateDate gt " + params.StartDate + " and CreateDate lt " + params.EndDate + ")&$expand=Mentees,ActivityToolItems,ActivityStandardItems";
        }
            
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
}

export default ReportsApi;
