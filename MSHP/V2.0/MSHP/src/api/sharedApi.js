import Config from './config';
import enrollmentApi from '../api/enrollmentApi';
import Utilities from '../utilities/utilities';
// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getRoles(allRoles){
    let isAdmin = false;
    let isCampus = false;
    let isReports = false;
    let roles = [];
    allRoles.forEach(function(item) {
        if(item == 'MSHP_Admin'|| item == 'TADS_Admin')
            isAdmin = true;
        else if(item == 'MSHP_Campus')
            isCampus = true;
        else if(item == 'MSHP_Reports')
            isReports = true;
    });
    if(isAdmin === true) roles.push('Admin');
    if(isCampus === true) roles.push('Campus');
    if(isReports === true) roles.push('Report');
    return roles;
}

class SharedApi {
    static getUserProperties() {
        return new Promise((resolve, reject) => {
        let userProps = {};
        let user = {firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '', defaultReportDateID:'', enrollments: [],  isChoseSchool: true };
        let currentLoginPromise = this.getCurrentUserLogin();
        currentLoginPromise.then(
            function (currentUserLogin) {
                user.loginId = currentUserLogin.loginName.replace('AD\\', '');
                user.fullName = currentUserLogin.name;
                user.roles = getRoles(currentUserLogin.roles);
                user.role = user.roles[0];
                let staffInfoPromise = SharedApi.getUserByLoginID(user.loginId);
                staffInfoPromise.then(
                    function(staffInfo){
                        if(staffInfo.value && staffInfo.value.length > 0){
                            user.firstName = staffInfo.value[0].FirstName;
                            user.lastName = staffInfo.value[0].LastSurName;
                            user.employeeID = staffInfo.value[0].EmployeeNumber;
                            user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey,
                            user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                            user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
                        }
                        userProps.user = user;
                        resolve(userProps);
                    }
                );
            });
        });      
    }

    static getCurrentUserLogin() {
        let serviceUrl = Config.REST_URL + 'common/api/userinfo';
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });      
    }

    static getUserByLoginID(loginId) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=LoginId eq '" + loginId + "'&$expand=EducationOrganization";
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });       
    }

    static getNavigationItems(role) {
        return new Promise((resolve, reject) => {
            let menuOptions = [];
            if (role === "Admin") {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#', icon: 'Add' },
                    { name: 'Admin', key: 'Admin', url: '#', icon: 'Add',
                        links:  [ 
                            { name: 'Annual Setup', key: 'annualsetup', url: '#annualsetup', icon: 'Add' },
                            { name: 'Calendar', key: 'calendar', url: '#calendar', icon: 'Add' }
                                ],
                            isExpanded: true
                    },
                    { name: 'Enrollment', key: 'enrollment', url: '#', icon: 'Add',
                        links:  [ 
                            { name: 'Enrollment Input', key: 'enrollmentinput', url: '#enrollmentinput', icon: 'Add' },
                            { name: 'Enrollment History', key: 'enrollmenthistory', url: '#enrollmenthistory', icon: 'Add' } 
                                ],
                            isExpanded: true
                    },
                    { name: 'School Profile', key: 'campusprofile', url: '#campusprofile', icon: 'Add' },
                   
                    { name: 'Reports', key: 'reports', url: '#', icon: 'Add',
                        links:  [ 
                            { name: 'Summary Report', key: 'summaryreport', url: '#summaryreport', icon: 'Add' },
                            { name: 'Detail Report', key: 'detailreport', url: '#detailreport', icon: 'Add' },
                            { name: 'Non Reporting Schools', key: 'nonreportingschool', url: '#nonreportingschool', icon: 'Add' },
                            { name: 'Summary and Detail Report', key: 'summarydetailreport', url: '#summarydetailreport', icon: 'Add' }
                                ],
                                isExpanded: true
                    }
                ];
            }
            else if (role === "Campus") {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#', icon: '' },
                    { name: 'Enrollment Input', key: 'enrollmentinput', url: '#enrollmentinput', icon: 'Add' },
                    { name: 'Enrollment History', key: 'enrollmenthistory', url: '#enrollmenthistory', icon: 'Add' },
                    { name: 'School Profile', key: 'campusprofile', url: '#campusprofile', icon: 'Add' },
                    { name: 'Reports', key: 'reports', url: '#', icon: 'Add',
                        links:  [ 
                                    { name: 'Summary Report', key: 'summaryreport', url: '#summaryreport', icon: 'Add' },
                                    { name: 'Detail Report', key: 'detailreport', url: '#detailreport', icon: 'Add' },
                                    { name: 'Non Reporting Schools', key: 'nonreportingschool', url: '#nonreportingschool', icon: 'Add' },
                                    { name: 'Summary and Detail Report', key: 'summarydetailreport', url: '#summarydetailreport', icon: 'Add' }
                                ],
                                isExpanded: true
                        }
                ];
            }
            else if (role === "Report") {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#', icon: '' },
                    { name: 'Summary Report', key: 'summaryreport', url: '#summaryreport', icon: 'Add' },
                    { name: 'Detail Report', key: 'detailreport', url: '#detailreport', icon: 'Add' },
                    { name: 'Non Reporting Schools', key: 'nonreportingschool', url: '#nonreportingschool', icon: 'Add' },
                    { name: 'Summary and Detail Report', key: 'summarydetailreport', url: '#summarydetailreport', icon: 'Add' }
                ];
            }

            if (Config.SHOW_LOGIN) {
                menuOptions = [...menuOptions, { name: 'Login', key: 'login', url: '#login', icon: 'Login' }];
            }
            resolve(menuOptions);
        });
    }

    static getCustomUserProperties(userID) {
    return new Promise((resolve, reject) => {
        let userProps = {};
        let user = { firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '' ,defaultReportDateID: '', enrollments: [], isChoseSchool: true};
        let currentLoginPromise = this.getCustomCurrentUserLogin(userID);
        currentLoginPromise.then(
            function (currentUserLogin) {
                user.loginId = currentUserLogin.loginName.replace('AD\\', '');
                user.fullName = currentUserLogin.name;
                user.roles = getRoles(currentUserLogin.roles);
                user.role = user.roles[0];
                let staffInfoPromise = SharedApi.getUserByLoginID(user.loginId);
                staffInfoPromise.then(
                    function (staffInfo) {
                        if (staffInfo.value && staffInfo.value.length > 0) {
                            user.firstName = staffInfo.value[0].FirstName;
                            user.lastName = staffInfo.value[0].LastSurName;
                            user.employeeID = staffInfo.value[0].EmployeeNumber;
                            user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey,
                                user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                            user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
                        }
                        userProps.user = user;
                        resolve(userProps);
                    }
                );
            });
    });
    }

    static getCustomCurrentUserLogin(userID) {
        let serviceUrl = Config.REST_URL + 'common/api/SelectedUserInfo?username=' + userID + '';
        const parameters = {
            method: 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'AppID': 'MSHP'
            }
          }; 

        return new Promise((resolve, reject) => {
            fetch( serviceUrl, parameters) 
            .then(function (response) {
                resolve(response.json());
            })
            .catch(function (error) {
                reject(error);
            });
        });    

    }

    static getPrincipal(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + campusID + "')?$expand=SchoolManagers($expand=CILSchoolManager)";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
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

}
export default SharedApi;
