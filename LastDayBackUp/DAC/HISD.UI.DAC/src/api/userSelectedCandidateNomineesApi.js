import Config from './config';

class UserSelectedCandidateNomineesApi {


    static getUserSelectedCandidateNominees(loginID, votingSettingID) {

        let serviceUrl = Config.REST_URL + "dac/odata/GetUserVoted(VotingSettingID=" + votingSettingID + ",CreatedBy='" + loginID + "')?$expand=CandidateType,Location";
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

}

export default UserSelectedCandidateNomineesApi