import Config from './config';

class CandidateTypesApi {    

    static loadCandidateTypes() {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateTypes";
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

    static loadJobCodesForCampusProfessional() {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateTypes?$filter=Description eq 'Campus Based Professional'&$expand=JobCode";
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

    static loadJobCodesForClassRoomTeachers() {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateTypes?$filter=Description eq 'Classroom Teacher'&$expand=SalaryPlanType,JobCode";
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

export default CandidateTypesApi;