import Config from './config';
import detailreportApi from '../api/detailreportApi';
import campusApi from '../api/campusApi';
class adminApi {

    static getAnnualSetup(SchoolYear) {
        let serviceUrl = Config.REST_URL + "mshp/odata/GetAnnualSetupDataByCampus(SchoolYear='"+ SchoolYear +"')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static updateCampusProfile(campusProfile) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile(" + campusProfile.Id + ")";
        let preview = JSON.stringify(campusProfile);
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(campusProfile),
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

    static updateReportCalendar(calendar) {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar(" + calendar.Id + ")";
        let preview = JSON.stringify(calendar);
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(calendar),
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

    static updateEnrollment(enrollment) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment(" + enrollment.Id + ")";
        let preview = JSON.stringify(enrollment);
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(enrollment),
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

    static updateOrganizationGroup(organizationgroup) {
        let serviceUrl = Config.REST_URL + "mshp/odata/OrganizationGroup(" + organizationgroup.Id + ")";
        let preview = JSON.stringify(organizationgroup);
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(organizationgroup),
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

    static createCampusEnrollment(enrollment) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(enrollment),
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

    static createCalendar(calendars) {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(calendars),
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

    static getOrganizationGroup(SchoolYear) {
        let serviceUrl = Config.REST_URL + "mshp/odata/OrganizationGroup?$filter=SchoolYear eq '" + SchoolYear +"'";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getPublicOrganizationGroup() {
        let serviceUrl = Config.PUBLIC_URL  + "public/api/OrganizationGroupEntity";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'FAS'
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

    static createOrganizationGroup(organizationsGroups) {
        let serviceUrl = Config.REST_URL + "mshp/odata/OrganizationGroup";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(organizationsGroups),
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

    static createCampusProfile(campusProfiles) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(campusProfiles),
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
export default adminApi;