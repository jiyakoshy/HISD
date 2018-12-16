import Config from './config';

class LocationsApi {    

    static loadLocations() {
        let serviceUrl = Config.REST_URL + "dac/odata/Locations";
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

export default LocationsApi;