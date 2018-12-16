import Config from './config';
import Utilities from '../utilities/utilities';

class AdminApi {

    static getHomeMessages(role) {

        // let serviceUrl = "http://localhost:52658/odata/HomeMessages";
        let serviceUrl = Config.REST_URL + "dac/odata/HomeMessages";
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
    static getHomeMessage() {
        // let serviceUrl = "http://localhost:52658/odata/HomeMessages?filter = IsActive eq true";
        let serviceUrl = Config.REST_URL + "dac/odata/HomeMessages?filter = IsActive eq true";
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
    static getHomeMessageByRole(role) {

        // let serviceUrl = "http://localhost:52658/odata/HomeMessages(1)";
        let serviceUrl = Config.REST_URL + "dac/odata/HomeMessages(1)";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include'
            })
                .then(function (response) {
                    const responseJson = response.json();
                    responseJson.then(res => {
                        const messages = res.value;
                        let homeMessage = {};
                        let selected = {};
                        let newMessages = $.grep(messages, function (n, i) { return n.IsActive == true; });
                        if (newMessages.length > 0)
                            selected = newMessages[0];

                        if (selected.HomeMessageID) {
                            homeMessage.HomeMessageID = selected.HomeMessageID;
                            homeMessage.HomeMessageHeader = selected.HomeMessageHeader;
                            homeMessage.HomeMessageBody = selected.HomeMessageBody;
                        }
                        setTimeout(() => {
                            resolve(homeMessage);
                        }, 2000);
                    });
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
}

export default AdminApi;