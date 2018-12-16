import Config from './config';

class generalWaiversApi {
    static getGeneralWaivers(startYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/GetGeneralWaivers(SchoolStartYear="+startYear+")";
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

    static deleteGeneralWaivers(waiverID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/WaiverAdministrations("+waiverID+")";
        const payload = {
            WaiverAdministrationID : waiverID,
            Deleted : true
        }
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static addGeneralWaivers(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/Waivers";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

    static updateGeneralWaivers(payload, wavierId) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART +"/odata/Waivers("+wavierId+")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PUT",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }

}

export default generalWaiversApi;