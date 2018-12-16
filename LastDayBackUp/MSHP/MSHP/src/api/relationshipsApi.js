import Config from './config';

class RelationshipsApi {
    
    static getRelationshipsByCampusID(campusID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllMentorMenteeRelationships?$filter=(EducationOrgNaturalKey eq '" + campusID + "' and TimeConfigurationID eq " + timeConfigurationID + ")&$orderby=MentorFirstName";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllMentorMenteeRelationships?$filter=(MentorEmployeeID eq '" + mentorEmployeeID + "' and MenteeEmployeeID eq '" + menteeEmployeeID + "' and TimeConfigurationID eq " + timeConfigurationID + ")&$orderby=MentorFirstName";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllMentorMenteeRelationships?$filter=(MentorMenteeRelationshipID eq " + relationshipID + ")";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
        let serviceUrl = Config.REST_URL + "MAS/odata/MentorMenteeRelationships";
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

    static deleteRelationship(relationshipID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MentorMenteeRelationships(" + relationshipID + ")";
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
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMentorsInActiveRelationshipByCampusID(CampusID='" + campusID + "')?$orderby=FirstName";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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

    static getMenteesInActiveRelationshipsByMentorID(employeeID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMenteesInActiveRelationshipByMentorID(EmployeeID='" + employeeID + "')?$filter=TimeConfigurationID eq " + timeConfigurationID + "&$orderby=FirstName";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'cache',
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
