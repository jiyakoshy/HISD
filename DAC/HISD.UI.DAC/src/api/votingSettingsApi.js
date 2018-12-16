import Config from './config';

class VotingSettingsApi {


    static getVotingSettings() {

        //  let serviceUrl = "http://localhost:52658/odata/VotingSettings";
        let serviceUrl = Config.REST_URL + "dac/odata/VotingSettings";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
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
    static getVotingSettingsActiveYear(activeYear) {
        //let serviceUrl = "http://localhost:52658/odata/VotingSettings?$filter= SchoolYear eq '" + activeYear + "'";
        let serviceUrl = Config.REST_URL + "dac/odata/VotingSettings?$filter= SchoolYear eq '" + activeYear + "'";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
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
    static getActiveVotingSettings() {
        let serviceUrl = Config.REST_URL + "dac/odata/VotingSettings?$filter=IsActive  eq true" ;
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
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


    static createVotingSettings(votingSettings) {
          let serviceUrl = Config.REST_URL + "dac/odata/VotingSettings";
      //  let serviceUrl = "http://localhost:52658/odata/VotingSettings";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(votingSettings),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
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
    static updateVotingSettings(votingSettings) {
        //let serviceUrl = "http://localhost:52658/odata/VotingSettings(" + votingSettings.VotingSettingID + ")";
          let serviceUrl = Config.REST_URL + "dac/odata/VotingSettings(" + votingSettings.VotingSettingID + ")";
        //   let changes = {TimeConfigurationID: timeConfig.TimeConfigurationID, SchoolYear: timeConfig.SchoolYear.trim(), SchoolStartDate: timeConfig.SchoolStartDate, SchoolEndDate: timeConfig.SchoolEndDate, LogStartDate: timeConfig.LogStartDate, LogEndDate: timeConfig.LogEndDate};
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(votingSettings),
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
}

export default VotingSettingsApi;