import Config from './config';

class CampusApi {
    static getAllCampuses() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OperationalStatusNaturalKey eq 'A' and EducationOrgNaturalKey ne '000' and OrgGrpNaturalKey eq 'Campus')&orderby=NameOfInstitution";
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

    static getAllCSO() {
        let serviceUrl = Config.REST_URL + "common/odata/SchoolManagers?$expand=EducationOrganization,Up2Manager";
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


    static getCampusesByManager(managerStaffNaturalKey) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs('" + managerStaffNaturalKey + "')?$expand=SchoolManagers($expand=EducationOrganization)";
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
}

export default CampusApi;
