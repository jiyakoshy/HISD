import Config from './config';

class ApplicationAdminApi {
    static getWaiverSettings(startYear) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/WaiverSettings?$filter=SchoolStartYear eq "+startYear+"";
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

    static postWaiverSettings(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/WaiverSettings";
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

    static patchWaiverSettings(payload,settingsID) {
        payload.WaiverSettingID = settingsID;
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/WaiverSettings("+settingsID+")";
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

    static getWaiversList(startYear) {
        const preYear = startYear - 1;
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetGeneralWaivers(SchoolStartYear="+preYear+")";
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

    static postCopyWaivers(payload) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/CopyGeneralWaivers";
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
}

export default ApplicationAdminApi;