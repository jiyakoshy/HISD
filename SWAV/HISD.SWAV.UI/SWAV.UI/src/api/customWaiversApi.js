import Config from './config';

class customWaiversApi {
    static getCustomWaivers(startYear) {
        let serviceUrl = Config.REST_URL + "swav/odata/GetSchoolCustomWaivers(SchoolStartYear="+startYear+")?$filter=(WaiverStatusID eq 3)";
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

    static updateCustomWaivers(payload, wavierId) {
        let serviceUrl = Config.REST_URL + "swav/odata/Waivers("+wavierId+")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PUT",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json; odata=verbose',
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

    static deleteCustomWaivers(schoolWaiverId) {
        let serviceUrl = Config.REST_URL + "swav/odata/SchoolWaivers("+schoolWaiverId+")";
        const payload = {
            SchoolWaiverID : schoolWaiverId,
            SchoolWaiverDeleted : true
        }
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
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

    static approveCustomWaivers(schoolWaiverId) {
        let serviceUrl = Config.REST_URL + "swav/odata/SchoolWaivers("+schoolWaiverId+")";
        const payload = {
            CustomApprovalStatus : '1'     //true
        }
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
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

    static rejectCustomWaivers(schoolWaiverId) {
        let serviceUrl = Config.REST_URL + "swav/odata/SchoolWaivers("+schoolWaiverId+")";
        const payload = {
            CustomApprovalStatus : '2'
        }
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
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

    static sendEmail(email){
        let serviceUrl = Config.REST_URL + "swav/api/Email";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                body: JSON.stringify(email),
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

    static getEmailLoginIDApi(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('"+campusID+"')?$select=OrganizationCode,NameOfInstitution,Staffs&$expand=Staffs($filter=JobFunctionNaturalKey eq 'PRINCIPAL' and StaffActiveIndicator eq true)";
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
export default customWaiversApi;