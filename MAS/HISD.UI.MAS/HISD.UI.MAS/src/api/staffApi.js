import Config from './config';

class StaffApi {
    static getStaffByEmployeeID(employeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs('" + employeeID + "')";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :Config.Headers 
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }
    
    static getStaffsByCampusID(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=EducationOrgNaturalKey eq '" + campusID + "'  and StaffActiveIndicator eq true&$orderby=LastSurname&$expand=StaffElectronicEmail";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :Config.Headers 
            })
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    static getMenteeActivitiesAPI(campusID, timeConfigID, startDate, endDate) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART  + "/odata/GetTotalActivitiesByMentees(TimeConfigurationID="+timeConfigID+",CampusID='"+campusID+"',StDate='"+startDate+"',EdDate='"+endDate+"')";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
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

export default StaffApi;
