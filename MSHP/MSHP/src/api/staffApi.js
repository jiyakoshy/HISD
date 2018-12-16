import Config from './config';

class StaffApi {
    static getStaffByEmployeeID(employeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs('" + employeeID + "')";
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
    
    static getStaffsByCampusID(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=EducationOrgNaturalKey eq '" + campusID + "'&$orderby=LastSurname&$expand=StaffElectronicEmail";
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

export default StaffApi;
