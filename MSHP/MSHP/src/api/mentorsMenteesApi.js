import Config from './config';
import Utilities from '../utilities/utilities';
class MentorsMenteesApi {
    static getAllMentors() {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMentors";
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

    static getMentorsByCampus(campusID) {
        const serviceUrl = Config.REST_URL + "common/odata/Staffs?$expand=StaffElectronicEmail,JobFunction&$filter=(EducationOrgNaturalKey eq '" + campusID + "' and StaffActiveIndicator eq true)&$orderby=FirstName,LastSurname";
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

    static getAllMentees() {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMentees";
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMenteesByCampusID(CampusID='" + campusID + "')?$orderby=FirstName,LastSurname";
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
