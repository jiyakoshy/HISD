import Config from './config';
import Utilities from '../utilities/utilities';

class CampusApi {
    static getAllCampuses() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OperationalStatusNaturalKey eq 'A' and EducationOrgNaturalKey ne '000' and OrgGrpNaturalKey eq 'Campus')&orderby=NameOfInstitution";
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });     
    }

    static getCSOByCampus(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + campusID + "')?$expand=SchoolManagers($expand=Up2Manager)";
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
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
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
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
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
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
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
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
