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
    let isSC = false;
    let roles = [];
    allRoles.forEach(function(item) {
        if(item == 'SWAV_Admin')
            isAdmin = true;
        else if(item == 'SWAV_Campus') 
            isSC = true;
        else if(item == 'Principal')
            isPrincipal = true; 
    });
    if(isAdmin === true) roles.push('Admin');
    if(isPrincipal === true) roles.push('Principal');
    if(isSC === true) roles.push('SC');
    //if (roles.length <= 0) roles.push('No Role');
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
       let serviceUrl = Config.REST_URL + 'common/api/SelectedUserInfo?username='+userID+'';
      
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

    static getPrincipal(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + campusID + "')?$expand=SchoolManagers($expand=CILSchoolManager)";
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
                    { name: 'Home', key: 'home', url: '#', icon: '' },
                    { name: 'School List – Waiver Selection', key:'schools', url:'#schools'},
                    { name: 'Application Administration', key:'applicationAdmin', url: '#applicationAdmin'},
                    {
                        name: 'Waiver Administration',
                        links: [
                            {
                                name: 'General Waiver', key:'generalWaivers', url:'#generalWaivers'
                            },
                            {
                                name: 'Custom Waiver', key:'customWaivers', url:'#customWaivers'
                            }
                        ]
                    },
                    { name: 'Waiver Request Details Form', key:'waiverRequestForm', url:'#waiverRequestForm'},
                    {
                        name: 'Reports',
                        links: [
                            {
                                name: 'State Report'
                            },
                            {
                                name: 'Local Report'
                            }
                        ]
                    }
                ];
            }
            if (role === "Principal") {
                menuOptions = [
                    { name: 'Home', key: 'home', url: '#', icon: '' },
                    { name: 'School List – Waiver Selection', key:'schools', url:'#schools'},
                    { name: 'Waiver Request Details Form', key:'waiverRequestForm', url:'#waiverRequestForm'}
                ];
            }
            if (role === "SC") {
                menuOptions = [
                    { name: 'Home', key: 'home', url: '#', icon: '' },
                    { name: 'School List – Waiver Selection', key:'schools', url:'#schools'},
                    { name: 'Waiver Request Details Form', key:'waiverRequestForm', url:'#waiverRequestForm'}
                ];
            }
            if (Config.SHOW_LOGIN) {
                menuOptions = [...menuOptions, { name: 'Login', key: 'login', url: '#login', icon: 'Login' }];
            }
            

            resolve(menuOptions);
        });
    }
}

export default SharedApi;
