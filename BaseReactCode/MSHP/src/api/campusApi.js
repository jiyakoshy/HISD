import Config from './config';
import Utilities from '../utilities/utilities';

class CampusApi {
    static getAllCampuses() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OperationalStatusNaturalKey eq 'A' and EducationOrgNaturalKey ne '000' and OrgGrpNaturalKey eq 'Campus')&orderby=NameOfInstitution";
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

    static getCampusesByManager(managerStaffNaturalKey) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs('" + managerStaffNaturalKey + "')?$expand=SchoolManagers($expand=EducationOrganization)";
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

    static getCampusesByStaff(staffNaturalKey) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs('" + staffNaturalKey + "')?$expand=EducationOrganization";
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

    static getGradeLevelsByCampusCurrentYear(campusID) {
        const schoolYearEnd = Utilities.getSchoolYearEnd();
        let serviceUrl = Config.REST_URL + "common/odata/SchoolGradeLevelAssociations?$filter=(EducationOrgNaturalKey eq '" + campusID + "' and SchoolYearNaturalKey eq  '" + schoolYearEnd + "')";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: 'get',
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

export default CampusApi;
