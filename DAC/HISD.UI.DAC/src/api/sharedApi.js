import Config from './config';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getRoles(allRoles) {
    let isAdmin = false;
    let isPrincipal = false;
    let isSC = false;
    let isNothing = false;
    let roles = [];
    allRoles.forEach(function (item) {
        if (item == 'DAC_ADMIN')
            isAdmin = true;
        else if (item == 'DAC_SC')
            isSC = true;
        else if (item == 'Principal')
            isPrincipal = true;



    });
    if (isAdmin === true) roles.push('Admin');
    if (isPrincipal === true) roles.push('Principal');
    if (isSC === true) roles.push('SC');

    if (roles.length <= 0) roles.push('Voter');
    return roles;
}

class SharedApi {
    static getUserProperties() {
        return new Promise((resolve, reject) => {
            let userProps = {};
            let user = { firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '' };
            let currentLoginPromise = this.getCurrentUserLogin();
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
                                if (staffInfo.value[0].EducationOrganization.OrgGrpNaturalKey == "Campus") {
                                    user.firstName = staffInfo.value[0].FirstName;
                                    user.lastName = staffInfo.value[0].LastSurname;
                                    user.employeeID = staffInfo.value[0].EmployeeNumber;
                                    user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey;
                                    user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.OrgGrpNaturalKey = staffInfo.value[0].EducationOrganization.OrgGrpNaturalKey;
                                    user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
                                    user.originalCampusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.originalCampusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
                                    user.JobFamilyNaturalKey = staffInfo.value[0].JobFamilyNaturalKey;
                                    user.JobCodeNaturalKey = staffInfo.value[0].JobCodeNaturalKey;
                                    user.SalaryPlanTypeNaturalKey = staffInfo.value[0].SalaryPlanTypeNaturalKey;
                                    user.JobFunctionNaturalKey = staffInfo.value[0].JobFunctionNaturalKey;
                                    user.PayGradeLevel = "";
                                }
                                else {
                                    user.firstName = staffInfo.value[0].FirstName;
                                    user.lastName = staffInfo.value[0].LastSurname;
                                    user.employeeID = staffInfo.value[0].EmployeeNumber;
                                    user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey;
                                    user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.OrgGrpNaturalKey = staffInfo.value[0].EducationOrganization.OrgGrpNaturalKey;
                                    user.campusName = "Central Office";
                                    user.originalCampusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.originalCampusName = "Central Office";
                                    user.JobFamilyNaturalKey = staffInfo.value[0].JobFamilyNaturalKey;
                                    user.JobCodeNaturalKey = staffInfo.value[0].JobCodeNaturalKey;
                                    user.SalaryPlanTypeNaturalKey = staffInfo.value[0].SalaryPlanTypeNaturalKey;
                                    user.JobFunctionNaturalKey = staffInfo.value[0].JobFunctionNaturalKey;
                                    user.PayGradeLevel = "";
                                }
                            }
                            else {
                                user.campusID = "000001";
                                user.campusName = "Central Office";
                                user.originalCampusID = "000001";
                                user.originalCampusName = "Central Office";
                                user.PayGradeLevel = "";

                            }
                            if (user.employeeID > 0 && user.SalaryPlanTypeNaturalKey != 'CON') {
                                let PayGradePromise = SharedApi.loadPayGradesEmployee(user.employeeID);
                                PayGradePromise.then(payGrade => {
                                    if (payGrade !== '' || payGrade !== null) {
                                        user.PayGradeLevel = payGrade.PayGradeLevel;
                                    }
                                    userProps.user = user;
                                    resolve(userProps);
                                });
                            }
                            else {
                                userProps.user = user;
                                resolve(userProps);
                            }
                        }
                    );
                });
        });
    }

    static getCurrentUserLogin() {
        let serviceUrl = Config.REST_URL + 'common/api/userinfo';

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
                                if (staffInfo.value[0].EducationOrganization.OrgGrpNaturalKey == "Campus") {
                                    user.firstName = staffInfo.value[0].FirstName;
                                    user.lastName = staffInfo.value[0].LastSurname;
                                    user.employeeID = staffInfo.value[0].EmployeeNumber;
                                    user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey;
                                    user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.OrgGrpNaturalKey = staffInfo.value[0].EducationOrganization.OrgGrpNaturalKey;
                                    user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
                                    user.originalCampusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.originalCampusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
                                    user.JobFamilyNaturalKey = staffInfo.value[0].JobFamilyNaturalKey;
                                    user.JobCodeNaturalKey = staffInfo.value[0].JobCodeNaturalKey;
                                    user.SalaryPlanTypeNaturalKey = staffInfo.value[0].SalaryPlanTypeNaturalKey;
                                    user.JobFunctionNaturalKey = staffInfo.value[0].JobFunctionNaturalKey;
                                    user.PayGradeLevel = "";
                                }
                                else {
                                    user.firstName = staffInfo.value[0].FirstName;
                                    user.lastName = staffInfo.value[0].LastSurname;
                                    user.employeeID = staffInfo.value[0].EmployeeNumber;
                                    user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey;
                                    user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.OrgGrpNaturalKey = staffInfo.value[0].EducationOrganization.OrgGrpNaturalKey;
                                    user.campusName = "Central Office";
                                    user.originalCampusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.originalCampusName = "Central Office";
                                    user.JobFamilyNaturalKey = staffInfo.value[0].JobFamilyNaturalKey;
                                    user.JobCodeNaturalKey = staffInfo.value[0].JobCodeNaturalKey;
                                    user.SalaryPlanTypeNaturalKey = staffInfo.value[0].SalaryPlanTypeNaturalKey;
                                    user.JobFunctionNaturalKey = staffInfo.value[0].JobFunctionNaturalKey;
                                    user.PayGradeLevel = "";
                                }
                            }
                            else {
                                user.campusID = "000001";
                                user.campusName = "Central Office";
                                user.originalCampusID = "000001";
                                user.originalCampusName = "Central Office";
                                user.PayGradeLevel = "";

                            }
                            if (user.employeeID > 0 && user.SalaryPlanTypeNaturalKey != 'CON') {
                                let PayGradePromise = SharedApi.loadPayGradesEmployee(user.employeeID);
                                PayGradePromise.then(payGrade => {
                                    if (payGrade !== '' || payGrade !== null) {
                                        user.PayGradeLevel = payGrade.PayGradeLevel;
                                    }
                                    userProps.user = user;
                                    resolve(userProps);
                                });
                            }
                            else {
                                userProps.user = user;
                                resolve(userProps);
                            }
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
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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

    static getNavigationItems(role) {
        return new Promise((resolve, reject) => {
            let menuOptions = [];
            if (role === "Admin") {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#home', icon: 'Add' },
                    { name: 'Voting Settings', key: 'votingsettings', url: '#votingsettings', icon: 'Voting' },
                    { name: 'Candidate Nominees', key: 'candidatenominees', url: '#candidatenominees', icon: 'Candidate' },
                    { name: 'Reports', key: 'reports', url: '#reports', icon: 'Reports' }
                ];
            }
            else if (role === "Principal") {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#home', icon: 'Add' },
                    { name: 'Candidate Nominees', key: 'candidatenominees', url: '#candidatenominees', icon: 'Add' },
                    { name: 'Cast Vote', key: 'castvote', url: '#castvotes', icon: 'Candidate' },
                    { name: 'Reports', key: 'reports', url: '#', icon: 'Add' }
                ];
            }
            else if (role === "SC") {
                menuOptions = [
                    { name: 'Dashboard', key: 'principalhome', url: '#', icon: '' },
                    { name: 'Candidate Nominees', key: 'candidatenominees', url: '#candidatenominees', icon: 'Add' },
                    { name: 'Cast Vote', key: 'castvote', url: '#castvotes', icon: 'Add' },
                    { name: 'Reports', key: 'reports', url: '#', icon: 'Add' }
                ];
            }
            else {
                menuOptions = [
                    { name: 'Dashboard', key: 'home', url: '#home', icon: 'Add' },
                    { name: 'Cast Vote', key: 'castvote', url: '#castvotes', icon: 'Add' },
                    { name: 'Reports', key: 'reports', url: '#reports', icon: 'Reports' }
                ];
            }
            if (Config.SHOW_LOGIN == "true") {
                menuOptions = [...menuOptions, { name: 'Login', key: 'login', url: '#login', icon: 'Login' }];
            }

            resolve(menuOptions);
        });
    }

    static getSchoolYearTypes() {
        let serviceUrl = Config.REST_URL + "common/odata/SchoolYearTypes?$filter=CurrentSchoolYear eq true";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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

    static getDepartmentsFromDepartmentID(queryOptions) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations?$filter=(" + queryOptions + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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
    static getStaffFromEmployeeNumber(queryOptions) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$select=FirstName,LastSurname,MiddleName,EmployeeNumber&$filter=(" + queryOptions + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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
    static getCampusTypeForYear(campusID, yearID) {
        let serviceUrl = Config.REST_URL + "common/odata/CampusTypeForYear(CampusID='" + campusID + "',YearID='" + yearID + "')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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
    static loadPayGradesEmployee(employeeID) {
        let serviceUrl = Config.REST_URL + "common/odata/StaffPayGradeAssociations('" + employeeID + "')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'DAC'
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
