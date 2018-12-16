import Config from './config';

class PayGradeApi {

    static loadPayGradesEmployee(employeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/StaffPayGradeAssociations('" + employeeID + "')";
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

    static loadPayGradesFromEmployeeIDs(queryEmployeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/StaffPayGradeAssociations?$filter=(" + queryEmployeeID + ")";
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



export default PayGradeApi;