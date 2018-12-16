import Config from './config';

class CentralOfficeApi {

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

export default CentralOfficeApi;