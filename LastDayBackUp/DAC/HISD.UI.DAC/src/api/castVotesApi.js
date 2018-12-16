import Config from './config';

class CastVotesApi {

    static createCastVotes(castVotes) {
        let serviceUrl = Config.REST_URL + "dac/odata/CastVote";
      return new Promise((resolve, reject) => {
          fetch(serviceUrl, {
              method: "POST",
              mode: 'cors',
              credentials: 'include',
              body: JSON.stringify(castVotes),
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

  static createCastVotesForCampus(castVotes) {
      console.log('castVotes---',castVotes);
    let serviceUrl = Config.REST_URL + "dac/odata/CastVoteForCampus";
  return new Promise((resolve, reject) => {
      fetch(serviceUrl, {
          method: "POST",
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(castVotes),
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

}

export default CastVotesApi;