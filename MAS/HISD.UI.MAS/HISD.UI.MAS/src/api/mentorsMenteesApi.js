import Config from './config';
import Utilities from '../utilities/utilities';
class MentorsMenteesApi {
    static getAllMentors() {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentors";
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

    // by_RR: Get Mentor Profile Details 
    static getMentorProfileByEmployeeID(employeeID) {
        const serviceUrl = Config.REST_URL + "common/odata/Staffs('" + employeeID + "')?$expand=StaffElectronicEmail,EducationOrganization,JobCode";
        //"common/odata/Staffs?$expand=StaffElectronicEmail,JobFunction&$filter=(EducationOrgNaturalKey eq '" + campusID + "' and StaffActiveIndicator eq true)&$orderby=FirstName,LastSurname";
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
    
    static getMentorsByCampus(campusID) {
        const serviceUrl = Config.REST_URL + "common/odata/Staffs?$expand=StaffElectronicEmail,JobFunction&$filter=(EducationOrgNaturalKey eq '" + campusID + "' and StaffActiveIndicator eq true)&$orderby=FirstName,LastSurname";
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

    static getAllMentees() {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentees";
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

    static getMenteesByCampus(campusID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMenteesByCampusID(CampusID='" + campusID + "')?$orderby=FirstName,LastSurname";
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

    static getAlreadyAddedMenteesByCampus(campusID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/MentorMenteeRelationships?$filter=TimeConfigurationID eq 1 and CampusID eq '"+campusID+"' and RelationshipStatus ne 'Inactive'";
        //let serviceUrl ="http://localhost:60262/odata/GetMentorMenteeRelationshipsMentees?$filter=TimeConfigurationID eq 1 and CampusID eq '"+campusID+"' and RelationshipStatus ne 'Inactive'";
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

export default MentorsMenteesApi;
