import Config from './config';

class CampusApi {
    static getAllCampuses() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OperationalStatusNaturalKey eq 'A' and EducationOrgNaturalKey ne '000' and OrgGrpNaturalKey eq 'Campus')&orderby=NameOfInstitution";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
                }
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getAllDepartments() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OperationalStatusNaturalKey eq 'A' and EducationOrgNaturalKey ne '000' )&orderby=NameOfInstitution";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
                }
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
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
                }
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getCentralOfficeDepartments() {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(OrgGrpNaturalKey ne 'Campus' and NameOfInstitution ne '' ) &$orderby=NameOfInstitution asc";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
                }
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
