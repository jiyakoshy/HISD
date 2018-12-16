import Config from './config';
import Utilities from '../utilities/utilities';
import MshpApi from '../api/mshpApi';

class AdminApi {
    static getAllTimeConfigs() {
        let serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations?$orderby=SchoolYear";
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

    static getTimeConfig(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations(" + timeConfigurationID + ")";
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

    static getTimeConfigBySchoolYear(schoolYear) {
        let serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations?$filter=SchoolYear eq '" + schoolYear + "'";
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

    static getCurrentTimeConfig() {
        const oDataDate = Utilities.getODataDate(new Date());
        const serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations?$filter=SchoolStartDate le " + oDataDate + " and SchoolEndDate ge " + oDataDate + "&$top=1";
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

    static updateTimeConfig(timeConfig) {
        let serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations(" + timeConfig.TimeConfigurationID + ")";
        let changes = { TimeConfigurationID: timeConfig.TimeConfigurationID, SchoolYear: timeConfig.SchoolYear.trim(), SchoolStartDate: timeConfig.SchoolStartDate, SchoolEndDate: timeConfig.SchoolEndDate, LogStartDate: timeConfig.LogStartDate, LogEndDate: timeConfig.LogEndDate };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(changes),
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

    static createTimeConfig(timeConfig) {
        let serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(timeConfig),
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

    static deleteTimeConfig(timeConfigurationID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/TimeConfigurations(" + timeConfigurationID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getAllActivityCodes() {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityCodes?$orderby=ActivityCodeName";
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

    static getActivityCode(activityCodeID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityCodes(" + activityCodeID + ")";
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

    static getActivityCodeByName(activityCodeName) {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityCodes?$filter=ActivityCodeName eq '" + activityCodeName + "'&$top=1";
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

    static updateActivityCode(activityCode) {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityCodes(" + activityCode.ActivityCodeID + ")";
        let changes = { ActivityCodeID: activityCode.ActivityCodeID, ActivityCodeDescription: activityCode.ActivityCodeDescription, Status: activityCode.Status };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(changes),
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

    static createActivityCode(activityCode) {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityCodes";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(activityCode),
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

    static deleteActivityCode(activityCodeID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityCodes(" + activityCodeID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getAllCBMStandards() {
        let serviceUrl = Config.REST_URL + "MAS/odata/CBMStandards?$orderby=MonthOrder";
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

    static getCBMStandard(cbmStandardID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/CBMStandards(" + cbmStandardID + ")";
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

    static updateCBMStandard(cbmStandard) {
        let serviceUrl = Config.REST_URL + "MAS/odata/CBMStandards(" + cbmStandard.CBMStandardID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(cbmStandard),
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

    static getAllActivityStandards() {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityStandardGroups?$expand=ActivityStandardItems&$orderby=ActivityStandardGroupID";
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

    static getAllMentoringTools() {
        let serviceUrl = Config.REST_URL + "MAS/odata/ActivityToolItems?$orderby=ActivityToolItemName";
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

    static getAllHomeMessages() {
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages?$select=HomeMessageID,HomeMessageRole,StartDate,EndDate&$orderby=HomeMessageRole";
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

    static getHomeMessage(homeMessageID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages(" + homeMessageID + ")";
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

    static getHomeMessageByRoleWithoutDates(role) {
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages?$filter=(HomeMessageRole eq '" + role + "')";
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
                        if (messages.length > 0)
                            homeMessage = messages[0];
                        resolve(homeMessage);
                    });
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getHomeMessageByRole(role) {
        const today = new Date();
        const monthNumber = today.getMonth() + 1;
        const day = today.getDate() < 10 ? "0" + today.getDate().toString() : today.getDate().toString();
        const month = monthNumber < 10 ? "0" + monthNumber.toString() : monthNumber.toString();
        const year = today.getFullYear().toString();
        const oDataDate = year + '-' + month + '-' + day + 'T00:00:00Z';
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages?$filter=((StartDate le " + oDataDate + " and EndDate ge " + oDataDate + ") and (HomeMessageRole eq '" + role + "' or HomeMessageRole eq 'All' or HomeMessageRole eq 'Maintenance'))";
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
                        let newMessages = $.grep(messages, function (n, i) { return n.HomeMessageRole == 'Maintenance'; });
                        if (newMessages.length > 0)
                            selected = newMessages[0];
                        else {
                            let newMessages = $.grep(messages, function (n, i) { return n.HomeMessageRole == 'All'; });
                            if (newMessages.length > 0)
                                selected = newMessages[0];
                            else {
                                let newMessages = $.grep(messages, function (n, i) { return n.HomeMessageRole == role; });
                                if (newMessages.length > 0)
                                    selected = newMessages[0];
                            }
                        }
                        if (selected.HomeMessageID) {
                            homeMessage.HomeMessageID = selected.HomeMessageID;
                            homeMessage.HomeMessageRole = selected.HomeMessageRole;
                            homeMessage.StartDate = new Date(Utilities.getDateTime(selected.StartDate));
                            homeMessage.EndDate = new Date(Utilities.getDateTime(selected.EndDate));
                            homeMessage.HomeMessageContent = selected.HomeMessageContent;
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

    static updateHomeMessage(homeMessage) {
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages(" + homeMessage.HomeMessageID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(homeMessage),
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

    static createHomeMessage(homeMessage) {
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(homeMessage),
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

    static deleteHomeMessage(homeMessageID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/HomeMessages(" + homeMessageID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getAllSiteContents() {
        let serviceUrl = Config.REST_URL + "MAS/odata/SiteContents?$orderby=SiteContentCode";
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

    static getSiteContent(siteContentID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/SiteContents(" + siteContentID + ")";
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

    static getSiteContentByCode(code) {
        let serviceUrl = Config.REST_URL + "MAS/odata/SiteContents?$filter=SiteContentCode eq '" + code + "'&$top=1";
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

    static updateSiteContent(siteContent) {
        let serviceUrl = Config.REST_URL + "MAS/odata/SiteContents(" + siteContent.SiteContentID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(siteContent),
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

    static deleteSiteContent(siteContentID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/SiteContents(" + siteContentID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getAllCampusContacts() {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllCampusContacts?$orderby=FirstName,LastSurname";
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

    static getCampusContactsByCampusID(campusID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetCampusContactsByCampusID(CampusID='" + campusID + "')?$orderby=FirstName,LastSurname";
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

    static getCampusContactByCampusIDAndEmployeeID(campusID, employeeID, timeConfigurationID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetCampusContactsByCampusID(CampusID='" + campusID + "')?&$filter=StaffNaturalKey eq '" + employeeID + "'";
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


    static deleteCampusContact(campusContactID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/CampusContacts(" + campusContactID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static createCampusContact(campusContact) {
        let serviceUrl = Config.REST_URL + "MAS/odata/CampusContacts";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(campusContact),
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

    static updateCampusContact(campusContact) {
        let serviceUrl = Config.REST_URL + "MAS/odata/CampusContacts(" + campusContact.CampusContactID + ")";
        const changes = { CampusContactID: campusContact.CampusContactID, CICEmployeeID: campusContact.CICEmployeeID };
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(changes),
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

    static getAllMenteesEndDates() {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetAllMenteeEndDates?$orderby=FirstName,LastSurname";
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

    static getMenteesEndDatesByCampusID(campusID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMenteeEndDatesByCampusID(CampusID='" + campusID + "')?$orderby=FirstName,LastSurname";
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

    static getMenteeEndDateByEmployeeID(employeeID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/GetMenteeEndDateByEmployeeID(EmployeeID='" + employeeID + "')";
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

    static updateMenteeEndDate(menteeEndDate) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MenteeEndDates(" + menteeEndDate.MenteeEndDateID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(menteeEndDate),
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

    static createMenteeEndDate(menteeEndDate) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MenteeEndDates";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(menteeEndDate),
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

    static deleteMenteeEndDate(menteeEndDateID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MenteeEndDates(" + menteeEndDateID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getVerificationCode() {
        let serviceUrl = Config.REST_URL + "MAS/odata/MultiChoiceLists?$filter=(MultiChoiceListCode eq 'VerificationComments' and Status eq true)&$expand=MultiChoiceListItems($filter=Status eq true)";
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

    static getVerificationCodeDetails(multiChoiceListItemID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MultiChoiceListItems(" + multiChoiceListItemID + ")";
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

    static createVerificationCodeDetails(verificationCodeDetails) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MultiChoiceListItems";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(verificationCodeDetails),
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

    static updateVerificationCodeDetails(verificationCodeDetails) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MultiChoiceListItems(" + verificationCodeDetails.MultiChoiceListItemID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(verificationCodeDetails),
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

    static deleteVerificationCodeDetails(multiChoiceListItemID) {
        let serviceUrl = Config.REST_URL + "MAS/odata/MultiChoiceListItems(" + multiChoiceListItemID + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "DELETE",
                mode: 'cors',
                credentials: 'include'
            })
                .then(function (response) {
                    if (response.ok == true)
                        resolve(response);
                    else {
                        reject(response.statusText);
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    static getCampusGradeLevelsByCampusCurrentYear(campusID) {
        const schoolYearEnd = Utilities.getSchoolYearEnd();
        let serviceUrl = Config.REST_URL + "common/odata/SchoolGradeLevelAssociations?$filter=(EducationOrgNaturalKey eq '" + campusID + "' and SchoolYearNaturalKey eq  '" + schoolYearEnd + "')&$select=GradeLvlTypeNaturalKey";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
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
    static getCampusProfileIDForState(campusID, schoolYear) {
        return new Promise((resolve, reject) => {
            let calendarIDPromise = MshpApi.getCalendarID(schoolYear);
            calendarIDPromise.then(
                function (calendarInfo) {
                    let calendarID = calendarInfo.value[0].Id;
                    if (campusID.length > 3) campusID = '001';
                        
                    let profileIDPromise = MshpApi.getCampusProfileID(campusID, calendarID);
                    profileIDPromise.then(
                        function (profileInfo) {
                            if (profileInfo) {
                                let campusProfileID = profileInfo.value[0].Id;

                                resolve(campusProfileID)
                            }
                        }
                    );
                });
        });
    }
}
export default AdminApi;
