import Config from './config';
import { setup, sp, SPRequestExecutorClient, Web, EmailProperties } from "sp-pnp-js";
import jspdf from 'jspdf';

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
        request.MentorAgreement = 'Pending';
        request.WebServiceURL = relationship.WebServiceURL;
        request.CampusID = relationship.CampusID;
        request.MenteeEmployeeID = relationship.MenteeEmployeeID;
        request.MentorEmployeeID = relationship.MentorEmployeeID;// emp id of Vishal
              
        if(relationship.MentorId > 0) request.MentorId = relationship.MentorId;
        if(relationship.MenteeId > 0) request.MenteeId = relationship.MenteeId;
        if(relationship.PrincipalId > 0) request.PrincipalId = relationship.PrincipalId;
        //if(relationship.CICId > 0) 
        request.CICId = relationship.CICId;

       /*  // testing purposes for email receiving 
        if (relationship.MentorId > 0) request.MentorId = 68; //Raju(13) as Mentor Jibin(60,68) Jagan(48)
        if (relationship.MenteeId > 0) request.MenteeId = 69; // Chris(9) as Mentee
        if (relationship.PrincipalId > 0) request.PrincipalId = 69; //Vishal(18,21) as principal 
        //if(relationship.CICId > 0)  Janice (22)
        request.CICId =68; // Dolly(16,22) as CIC Jagan(48,44)  Praveen(55,69) Shirisha(0,29) */

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

    static createMentorActivityLog(mentorActivityLog) {

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
        request.Title = 'New Data Inserted';
        request.month = mentorActivityLog.Month.toString();
        request.year = mentorActivityLog.Year.toString();
        request.logCountNeeded = mentorActivityLog.LogCountNeeded.toString();
        //request.actualLogCount = mentorActivityLog.ActualLogCount.toString();
        request.daysremaining = mentorActivityLog.DaysRemaining;
        request.mentorId = mentorActivityLog.Mentor;
        request.mentorLoginId = mentorActivityLog.MentorLoginId;
        request.menteeEmployeeID = mentorActivityLog.MenteeEmployeeId;
        return new Promise((resolve, reject) => {
            web.lists.getByTitle(process.env.MENTOR_ACTIVITY_LOG)
                .items.add(request)
                .then((response) => {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static updateMentorActivityLog(mentorActivityLog) {
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
        request.Title = 'Test Data Updated';
        request.month = mentorActivityLog.Month.toString();
        request.year = mentorActivityLog.Year.toString();
        request.logCountNeeded = mentorActivityLog.LogCountNeeded.toString();
        request.actualLogCount = 1;
        request.daysremaining = mentorActivityLog.DaysRemaining;
        request.mentorId = mentorActivityLog.Mentor;
        request.mentorLoginId = mentorActivityLog.MentorLoginId;
        request.menteeEmployeeID = mentorActivityLog.MenteeEmployeeId;
        return new Promise((resolve, reject) => {
            web.lists.getByTitle(process.env.MENTOR_ACTIVITY_LOG).items.top(1).
                filter("month eq '" + mentorActivityLog.Month.toString() + "' and year eq '" + mentorActivityLog.Year.toString() + "'  and  menteeEmployeeID eq '" + mentorActivityLog.MenteeEmployeeId + "' and  mentorLoginId eq '" + mentorActivityLog.MentorLoginId + "'").get().
                then((itemstobeupdated) => {
                    if (itemstobeupdated.length > 0) {
                        web.lists.getByTitle(process.env.MENTOR_ACTIVITY_LOG).items.getById(itemstobeupdated[0].ID).update({
                            actualLogCount: parseInt(itemstobeupdated[0].actualLogCount) + 1,
                            logCountNeeded: mentorActivityLog.LogCountNeeded.toString(),
                            daysremaining: mentorActivityLog.DaysRemaining
                        }).then(result => {
                            resolve(result);
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                    else {
                        request.Title = 'Mentor Activity log';
                        web.lists.getByTitle(process.env.MENTOR_ACTIVITY_LOG)
                            .items.add(request)
                            .then((response) => {
                                resolve(response);
                            })
                            .catch(function (error) {
                                reject(error);
                            });
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static updateMentorAgreementPDF(siteContent, PDFContent, specialElementHandlers) {
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

        let doc = new jspdf();

        doc.fromHTML(PDFContent, 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });

        let blob = new Blob();
        blob = doc.output('blob');
        var file = new File([blob], "Mentor Agreement.pdf");
        return new Promise((resolve, reject) => {
            web.getFolderByServerRelativeUrl("Shared%20Documents/").files.add(file.name, file, true)
                .then((result) => {
                    resolve(siteContent);
                })
                .catch(function (error) {
                    reject(error);
                });
        });


    }
    static updateRelationshipRequest(relationship) {
        //const userRole = this.props.userProps.user.role;
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
        request.RelationshipID = relationship.RelationshipID.toString();
        let relationshipTaskID = 'Mentor Acceptance Task' + request.RelationshipID;
        return new Promise((resolve, reject) => {
            web.lists.getByTitle('Workflow Tasks').items.
                filter("Title eq '" + relationshipTaskID.toString() + "'").get().
                then((itemstobeupdated) => {
                    if (itemstobeupdated.length > 0) {
                        resolve(itemstobeupdated[0].ID);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static updatePrincipalApprovalRequest(relationship) {
        //const userRole = this.props.userProps.user.role;
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
        //request.Title = relationship.MentorName + ' - ' + relationship.MenteeName + ' Relationship';
        //request.TimeConfigurationID = relationship.TimeConfigurationID.toString();
        //request.MentorAgreement = relationship.MentorAgreement.toString();
        //request.CampusID = relationship.CampusID;
        //request.MenteeEmployeeID = relationship.MenteeEmployeeID;

        request.RelationshipID = relationship.RelationshipID.toString();
        request.RelationshipStatus = relationship.RelationshipStatus.toString();
        request.PrincipalApproval = relationship.PrincipalApproval.toString();
        request.WebServiceURL = relationship.WebServiceURL;

        return new Promise((resolve, reject) => {
            web.lists.getByTitle(process.env.RELATIONSHIPS_LIST).items.top(1).
                filter("RelationshipID eq '" + relationship.RelationshipID.toString() + "'").get().
                then((itemstobeupdated) => {
                    if (itemstobeupdated.length > 0) {
                        // check whether need to update Principal approval
                        if (itemstobeupdated[0].PrincipalApproval != relationship.PrincipalApproval.toString()) {
                            web.lists.getByTitle(process.env.RELATIONSHIPS_LIST).items.getById(itemstobeupdated[0].ID).update({
                                PrincipalApproval: relationship.PrincipalApproval.toString()
                            }).then(result => {
                                resolve(result);
                            }).catch(function (error) {
                                reject(error);
                            });
                        }
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static updateRelationStatusRequest(relationship) {
        //const userRole = this.props.userProps.user.role;
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
        //request.Title = relationship.MentorName + ' - ' + relationship.MenteeName + ' Relationship';
        //request.TimeConfigurationID = relationship.TimeConfigurationID.toString();
        //request.MentorAgreement = relationship.MentorAgreement.toString();
        //request.CampusID = relationship.CampusID;
        //request.MenteeEmployeeID = relationship.MenteeEmployeeID;

        request.RelationshipID = relationship.RelationshipID.toString();
        request.RelationshipStatus = relationship.RelationshipStatus.toString();
        request.PrincipalApproval = relationship.PrincipalApproval.toString();
        request.WebServiceURL = relationship.WebServiceURL;

        return new Promise((resolve, reject) => {
            web.lists.getByTitle(process.env.RELATIONSHIPS_LIST).items.top(1).
                filter("RelationshipID eq '" + relationship.RelationshipID.toString() + "'").get().
                then((itemstobeupdated) => {
                    if (itemstobeupdated.length > 0) {
                        // check whether need to update Relationship Status
                        if (itemstobeupdated[0].RelationshipStatus != relationship.RelationshipStatus.toString()) {
                            web.lists.getByTitle(process.env.RELATIONSHIPS_LIST).items.getById(itemstobeupdated[0].ID).update({
                                RelationshipStatus: relationship.RelationshipStatus.toString()
                            }).then(result => {
                                resolve(result);
                            }).catch(function (error) {
                                reject(error);
                            });
                        }
                    }
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

    static sendEmail(email) {
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
                    if (response.ok == true)
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
