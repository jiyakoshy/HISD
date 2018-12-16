import Config from './config';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getRoles(allRoles){
    let isAdmin = false;
    let isPrincipal = false;
    let isCampus = false;
    let isReports = false;
    let roles = [];
    allRoles.forEach(function(item) {
        if(item == 'MSHP_Admin')
            isAdmin = true;
        else if(item == 'MSHP_Campus')
            isCampus = true;
        else if(item == 'MSHP_Reports')
            isReports = true;
        else if(item == 'Principal')
            isPrincipal = true; 
    });
    if(isAdmin === true) roles.push('Admin');
    if(isPrincipal === true) roles.push('Principal');
    if(isCampus === true) roles.push('Campus');
    if(isReports === true) roles.push('Reports');
    return roles;
}

class SharedApi {
    static getUserProperties() {
        return new Promise((resolve, reject) => {
        let userProps = {};
        let user = {firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: ''};
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

    static getUserByLoginID(loginId) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=LoginId eq '" + loginId + "'&$expand=EducationOrganization";
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

    static getNavigationItems(role) {
        return new Promise((resolve, reject) => {
            let menuOptions = [];
            if (role === "Admin") {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#', icon: 'Add' },
                    { name: 'Enrollment Input', key: 'enrollmentinput', url: '#', icon: 'Add' },
                    { name: 'Enrollment History', key: 'enrollmenthistory', url: '#', icon: 'Add' },
                    { name: 'School Profile', key: 'schoolprofile', url: '#', icon: 'Add' },
                    { name: 'Calendar', key: 'calendar', url: '#', icon: 'Add' },
                    { name: 'Summary Report', key: 'summaryreport', url: '#', icon: 'Add' },
                    { name: 'Detail Report', key: 'detailreport', url: '#', icon: 'Add' }
                ];
            }
            if (role === "Principal") {
                menuOptions = [
                    { name: 'Dashboard', key: 'principalhome', url: '#', icon: '' },
                    { name: 'Enrollment Input', key: 'enrollmentinput', url: '#', icon: 'Add' },
                    { name: 'Enrollment History', key: 'enrollmenthistory', url: '#', icon: 'Add' },
                    { name: 'School Profile', key: 'schoolprofile', url: '#', icon: 'Add' },
                    { name: 'Calendar', key: 'calendar', url: '#', icon: 'Add' },
                    { name: 'Summary Report', key: 'summaryreport', url: '#', icon: 'Add' },
                    { name: 'Detail Report', key: 'detailreport', url: '#', icon: 'Add' }
                ];
            }
            else if (role === "Campus") {
                menuOptions = [
                    { name: 'Dashboard', key: 'campushome', url: '#', icon: '' },
                    { name: 'Enrollment Input', key: 'enrollmentinput', url: '#', icon: 'Add' },
                    { name: 'Enrollment History', key: 'enrollmenthistory', url: '#', icon: 'Add' },
                    { name: 'School Profile', key: 'schoolprofile', url: '#', icon: 'Add' },
                    { name: 'Calendar', key: 'calendar', url: '#', icon: 'Add' },
                    { name: 'Summary Report', key: 'summaryreport', url: '#', icon: 'Add' },
                    { name: 'Detail Report', key: 'detailreport', url: '#', icon: 'Add' }
                ];
            }
            else if (role === "Report") {
                menuOptions = [
                    { name: 'Home', key: 'home', url: '#', icon: '' },
                    { name: 'Summary Report', key: 'summaryreport', url: '#', icon: 'Add' },
                    { name: 'Detail Report', key: 'detailreport', url: '#', icon: 'Add' }
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
        let user = { firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '' };
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

        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                body: undefined
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                    //console.log("error----", error);
                });
        });

    }

}
export default SharedApi;
