import Config from './config';

class EnrollmentApi {
    static getEnrollmentHistory(campusprofileid) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/CampusEnrollment?$filter=CampusProfileId eq (" + campusprofileid + ")";
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

export default EnrollmentApi;
