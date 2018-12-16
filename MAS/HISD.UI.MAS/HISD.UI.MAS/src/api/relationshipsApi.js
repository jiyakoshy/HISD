import Config from './config';

class RelationshipsApi {
    
    // dashboard:Admin    
    static getCampusesCountUsingMAS(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$apply=filter (TimeConfigurationID eq " + timeConfigurationID + ")/groupby((EducationOrgNaturalKey))&$count=true";
        
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

    // dashboard:Admin    
    static getentorAgreementAcceptenceSummary(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$apply=filter (TimeConfigurationID eq " + timeConfigurationID + " and MentorAgreement ne 'Accepted')/groupby((MentorEmployeeID))&$count=true";
        
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

    // dashboard:Admin    
    static getAllRelationshipsStatusSummary(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$apply=filter (TimeConfigurationID eq " + timeConfigurationID + ")/groupby((RelationshipStatus),aggregate(MentorMenteeRelationshipID with countdistinct as total))";
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

    // dashboard:Admin    
    static getopRelationshipsCampues(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$apply=filter (TimeConfigurationID eq " + timeConfigurationID + ")/groupby((EducationOrgNaturalKey,NameOfInstitution),aggregate(MentorMenteeRelationshipID with countdistinct as RelationshipsCount))&$orderby=RelationshipsCount desc";
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

    static getop3RelationshipsCampues(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetTopCampusesOnRelationShipFromTimeConfiguration(TimeConfigurationID="+ timeConfigurationID+")";
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




    // dashboard: Prinicipal/CIC
    static getRelationshipStatusSummaryByCampusID(campusID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$apply=filter (EducationOrgNaturalKey eq '" + campusID + "'and TimeConfigurationID eq " + timeConfigurationID + ")/groupby((RelationshipStatus),aggregate(MentorMenteeRelationshipID with countdistinct as total))";
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

    static getRelationshipsByCampusID(campusID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$filter=(EducationOrgNaturalKey eq '" + campusID + "' and TimeConfigurationID eq " + timeConfigurationID + ")&$orderby=MentorFirstName";
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

    static getRelationshipsByMentorAndMentee(mentorEmployeeID, menteeEmployeeID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$filter=(MentorEmployeeID eq '" + mentorEmployeeID + "' and MenteeEmployeeID eq '" + menteeEmployeeID + "' and TimeConfigurationID eq " + timeConfigurationID + ")&$orderby=MentorFirstName";
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

    static getRelationshipByID(relationshipID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$filter=(MentorMenteeRelationshipID eq " + relationshipID + ")";
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

    static getRelationshipByMentorIDandTimeConfig(mentorID,timeConfig) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/MentorMenteeRelationships?$filter=MentorEmployeeID eq '" +mentorID +"' and TimeConfigurationID eq "+ timeConfig +" and MentorAgreement eq 'Accepted' and RelationshipStatus ne 'Inactive'";
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

    static createRelationship(relationship) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/MentorMenteeRelationships";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(relationship),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
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

    static updateRelationship(relationship) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/MentorMenteeRelationships(" + relationship.MentorMenteeRelationshipID + ")";
        //let changes = {MentorMenteeRelationshipID: this.props.mentee.MentorMenteeRelationshipID, MentorEmployeeID: this.props.mentee.MentorEmployeeID, MenteeEmployeeID: this.props.mentee.MenteeEmployeeID, 
        //                    MentorAgreement: this.state.MentorAgreement, CampusID: this.props.mentee.EducationOrgNaturalKey, RelationshipStatus: this.props.mentee.RelationshipStatus, TimeConfigurationID: this.props.mentee.TimeConfigurationID};
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, { 
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(relationship),
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

    static deleteRelationship(relationshipID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/MentorMenteeRelationships(" + relationshipID + ")";
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

    static getMentorsInRelationshipsByCampusID(campusID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentorsInActiveRelationshipByCampusID(CampusID='" + campusID + "')?$orderby=FirstName";
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

    // NO timeconfigurationID: by_RR
    static getMentorsInActiveRelationshipsByCampusID(campusID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentorsInActiveRelationshipByCampusID(CampusID='" + campusID + "')?$orderby=FirstName";
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
    // Mentor Profile by MentorID and CampusID: NOT BEEN USED
    static getMentorProfileByEmployeeIDandCampusID(employeeID, campusID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentorsInActiveRelationshipByCampusID(CampusID='" + campusID + "')?$filter=StaffNaturalKey eq '" + employeeID + "'";
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
    
    static getMenteesInActiveRelationshipsByCampusID(campusID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMenteesInActiveRelationshipByCampusID(CampusID='" + campusID + "')?$orderby=FirstName,LastSurname";
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

    static getMenteesInActiveRelationshipsByMentorID(employeeID, timeConfigurationID, campusID) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMenteesInActiveRelationshipByMentorID(EmployeeID='"+employeeID+"')?$filter=TimeConfigurationID eq "+ timeConfigurationID +" and EducationOrgNaturalKey eq '"+campusID+"' &$orderby=FirstName";
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

    // GetMenteeRelationshipProfileByEmployeeID
    static getMenteeRelationshipProfileByEmployeeID(employeeID) {
        const serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetAllMentorMenteeRelationships?$filter=(MenteeEmployeeID eq '" + employeeID + "')";
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

    static getRelationshipsCountByStatus(timeConfigurationID, CampusID){
        const serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetRalationshipCountsByStatus(TimeConfigurationID="+timeConfigurationID+",CampusID='"+CampusID+"')";
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

    static getMentorAgreementDetailsAPI(timeConfigurationID){
        const serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/GetMentorsCountWithoutAgreementAccepted(TimeConfigurationID ="+timeConfigurationID+")";
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

export default RelationshipsApi;
