import Config from './config';
import { setup, sp, SPRequestExecutorClient, Web, EmailProperties } from "sp-pnp-js";

class SharePointApi {
    static createRelationshipRequest(relationship) {
        const siteUrl = process.env.SITE_COLLECTION;
        setup({
            fetchClientFactory: () => {
                return new SPRequestExecutorClient();
            },
            headers: {
                'Accept': 'application/json; odata=verbose'
            }
        });
        const url = window.location.origin;
        let web = sp.crossDomainWeb(url, siteUrl);
        let request = {};
        request.Title = relationship.MentorName + ' - ' + relationship.MenteeName + ' Relationship';
        request.RelationshipID = relationship.RelationshipID.toString();
        request.TimeConfigurationID = relationship.TimeConfigurationID.toString();
        request.RelationshipStatus = 'Not Started';
        request.WebServiceURL = relationship.WebServiceURL;
        request.CampusID = relationship.CampusID;
        request.MenteeEmployeeID = relationship.MenteeEmployeeID;
        if(relationship.MentorId > 0) request.MentorId = relationship.MentorId;
        if(relationship.MenteeId > 0) request.MenteeId = relationship.MenteeId;
        if(relationship.PrincipalId > 0) request.PrincipalId = relationship.PrincipalId;
        if(relationship.CICId > 0) request.CICId = relationship.CICId;
        
        return new Promise((resolve, reject) => {
            web.lists.getByTitle(process.env.RELATIONSHIPS_LIST)
            .items.add(request)
            .then((response) => {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    static getSPUserPropertiesByLoginID(loginID) {
        const siteUrl = process.env.SITE_COLLECTION;
        setup({
            fetchClientFactory: () => {
                return new SPRequestExecutorClient();
            },
            headers: {
                'Accept': 'application/json; odata=verbose'
            }
        });
        const url = window.location.origin;
        const login = "AD\\" + loginID;
        let web = sp.crossDomainWeb(url, siteUrl);
        return new Promise((resolve, reject) => {
            web.ensureUser(loginID)
            .then((response) => {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

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


        // let web = sp.crossDomainWeb(url, siteUrl);
        
        // return new Promise((resolve, reject) => {
        //     sp.utility.sendEmail(emailProps)
        //     .then(response => {
        //         resolve(response);
        //     })
        //     .catch(function (error) {
        //         reject(error);
        //     });
        // });
    }
}

export default SharePointApi;
