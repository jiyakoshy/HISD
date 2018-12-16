import Config from './config';
import { setup, sp, SPRequestExecutorClient, Web, EmailProperties } from "sp-pnp-js";

class SharePointApi {
    static sendEmail(email){
        let serviceUrl = process.env.SITE_COLLECTION + "_api/SP.Utilities.Utility.SendEmail";
        const url = window.location.origin;
        serviceUrl = url + "/_api/SP.Utilities.Utility.SendEmail";
        setup({
            fetchClientFactory: () => {
                return new SPRequestExecutorClient();
            },
            headers: {
                'Accept': 'application/json; odata=verbose'
            }
        });
        const properties = {
            //From: [email.from],
            To: [email.to],
            Subject: email.subject,
            Body: email.body
            , "__metadata": { "type": "SP.Utilities.EmailProperties" }
        };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(properties),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            })
            .then(function (response) {
                if(response.ok == true)
                    resolve(response.json());
                else
                    reject(response.statusText);
            })
            .catch(function (error) {
                reject(error);
            });
        });

    }
}

export default SharePointApi;
