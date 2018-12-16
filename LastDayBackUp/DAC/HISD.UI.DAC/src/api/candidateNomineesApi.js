import Config from './config';

class CandidateNomineesApi {


    static createCandidateNominees(candidateNominees) {
        let serviceUrl = Config.REST_URL + "dac/odata/AddCandidateNominee";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(candidateNominees),
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

    static loadCandidateNomineesCentralOffice(votingSettingID, locationID , candidateTypeID) {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateNominees?$filter=VotingSettingID eq " + votingSettingID + " and LocationID eq "+locationID + " and (CandidateTypeID eq "+candidateTypeID[0]+" or CandidateTypeID eq "+candidateTypeID[1]+" or CandidateTypeID eq "+candidateTypeID[2]+"  )";
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
    static loadCandidateNomineesBasedOnLocation(votingSettingID, locationID ) {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateNominees?$filter=VotingSettingID eq "+votingSettingID+" and LocationID eq "+locationID+ "";
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
    static loadCandidateNomineesUsingCampusID(votingSettingID, campusID) {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateNominees?$filter=(CampusID eq '"+campusID +"' and VotingSettingID eq "+votingSettingID+")&$expand=CandidateType,Location";
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
    static loadCandidateNomineesForCampusFromSchoolYear(votingSettingID) {
        let serviceUrl = Config.REST_URL + "dac/odata/GetCandidateNomineesForCampusFromSchoolYear(VotingSettingID="+votingSettingID+")?$expand=CandidateType";
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

    
    static deleteCandidateNominee(candidateNomineeID) {
        let serviceUrl = Config.REST_URL + "dac/odata/CandidateNominees(" + candidateNomineeID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
            .then(function (response) {
                if(response.ok == true)
                    resolve(response);
                else{
                    reject(response.statusText);
                }
            })
            .catch(function (error) {
                reject(error);
            });
        });
    }
}
export default CandidateNomineesApi;