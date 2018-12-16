import Config from './config';
import AdminApi from './adminApi';
import MshpApi from '../api/mshpApi';
import Utilities from '../utilities/utilities';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getRoles(allRoles) {
    let isAdmin = false;

    let isCampus = false;
    let isReports = false;
    let isNormalUser = false;

    let roles = [];

    allRoles.forEach(function (item) {
        if (item == 'MSHP_Admin')
            isAdmin = true;
        else if (item == 'MSHP_Campus')
            isCampus = true;
        else if (item == 'MSHP_Reports')
            isReports = true;
        else
            isNormalUser = true;


    });
   
    
    //order had been A/C/R/U (and results in gfm role=Admin)....so set back if not
    if (isAdmin) roles.push('Admin');
    if (isCampus) roles.push('Campus');
     
    
    if (isReports) roles.push('Reports');
    //if (isNormalUser) roles.push('User');   
    
         
        /* roles.push('Campus');
        roles.push('Admin'); */
     
    return roles;
}

class SharedApi {
    static getUserProperties() {
        return new Promise((resolve, reject) => {
            let userProps = {};
            let user = { firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '', enrollments: [], defaultReportDateID: '', isChoseSchool: true };
            let currentLoginPromise = this.getCurrentUserLogin();
            currentLoginPromise.then(
                function (currentUserLogin) {
                    user.loginId = currentUserLogin.loginName.replace('AD\\', '');
                    user.roles = getRoles(currentUserLogin.roles);
                    
//                    if (user.loginID == 'gmarks')  user.roles.pop();
                    
                    user.role = user.roles[0];
                    
                        
                    let staffInfoPromise = SharedApi.getUserByLoginID(user.loginId);//gfm must set this back to user.LoginId
                    staffInfoPromise.then(
                        function (staffInfo) {
                            if (staffInfo.value && staffInfo.value.length > 0) {
                                user.firstName = staffInfo.value[0].FirstName;
                                user.lastName = staffInfo.value[0].LastSurname;
                                user.fullName = staffInfo.value[0].FirstName + " " + staffInfo.value[0].LastSurname;
                                user.employeeID = staffInfo.value[0].EmployeeNumber;
                                user.campusID = staffInfo.value[0].EducationOrgNaturalKey;//
                                user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;//
                                


                                user.isChoseSchool = true;
                                if (user.campusID.length > 3){
                                    user.campusID = '001';
                                    user.campusName = 'Austin HS';
                                    //user.isChoseSchool = false;

                                } 
                                
                                
                                user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey;
                                userProps.user = user;
                                resolve(userProps);

                                /* let gradeLevelsPromise = SharedApi.getGradeLevelsByCampusCurrentYear(user.campusID);
                                gradeLevelsPromise.then(
                                    function (gradeLevelsInfo) {
                                        if (gradeLevelsInfo && gradeLevelsInfo.value.length > 0) {
                                            user.campusGradeLevels = Utilities.sortGradeLevels(gradeLevelsInfo.value);
                                        }
                                        else {
                                            user.campusGradeLevels = [];
                                        }
                                    }
                                ); */
                                /*  let principalInfoPromise = SharedApi.getPrincipal(user.campusID);
                                 principalInfoPromise.then(
                                     function(principalInfo){
                                         if(principalInfo && principalInfo.SchoolManagers && principalInfo.SchoolManagers.CILSchoolManager){
                                             user.principalEmployeeID = principalInfo.SchoolManagers.CILSchoolManager.StaffNaturalKey;
                                             user.principalName = principalInfo.SchoolManagers.CILSchoolManager.FirstName + " " + principalInfo.SchoolManagers.CILSchoolManager.LastSurname;
                                             user.principalLoginID = principalInfo.SchoolManagers.CILSchoolManager.LoginId;
                                         }
                                         else{
                                             user.principalEmployeeID = "";
                                             user.principalName = "";
                                             user.principalLoginID = "";
                                         }
                                     }
                                 ); */
                                /* let cicInfoPromise = AdminApi.getCampusContactsByCampusID(user.campusID);
                                cicInfoPromise.then(
                                    function (cicInfo) {
                                        if (cicInfo && cicInfo.value.length > 0) {
                                            user.campusContacts = cicInfo.value;
                                        }
                                        else {
                                            user.campusContacts = [];
                                        }
                                    }
                                ); */
                                //let currentSchoolYear = Utilities.getSchoolYear();
                                //let calRepDatesPromise = MshpApi.getCalendarReportDatesByYear(currentSchoolYear);
                             
                                /* let calRepDatesPromise = MshpApi.getCalendarReportDates();
                                calRepDatesPromise.then(
                                    function (rptDateInfo) {
                                        if (rptDateInfo && rptDateInfo.value.length > 0) {
                                            user.calendarReportDates = rptDateInfo.value;
                                        }
                                        else {
                                            user.calendarReportDates = [];
                                        }
                                        
                                        //user.defaultReportDateID = Utilities.getMostRecentReportDateID(user.calendarReportDates);
                                    }
                                );
 */
                                /* let campusProfilePromise = AdminApi.getCampusProfileIDForState(user.campusID, currentSchoolYear);
                                campusProfilePromise.then(
                                    function (campusProfileIDInfo) {
                                        if (campusProfileIDInfo) {
                                            user.campusProfileID = campusProfileIDInfo;
                                        }
                                        else {
                                            user.campusProfileID = 0;
                                        }
                                        userProps.user = user;
                                        resolve(userProps);
                                    }
                                ); */
                            }
                            
                            /* let timeConfigPromise = AdminApi.getCurrentTimeConfig();
                            timeConfigPromise.then(
                                function (timeConfig) {
                                    if (timeConfig.value != null && timeConfig.value.length > 0)
                                        userProps.timeConfigurationID = timeConfig.value[0].TimeConfigurationID;
                                    
                                }); */
                        }
                    );
                });
        });
    }
    static getCustomUserProperties(userID) {
        return new Promise((resolve, reject) => {
            let userProps = {};
            let user = { firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '', enrollments: [], defaultReportDateID: '', isChoseSchool: true };
            let currentLoginPromise = this.getCustomCurrentUserLogin(userID);
            currentLoginPromise.then(
                function (currentUserLogin) {
                    user.loginId = currentUserLogin.loginName.replace('AD\\', '');
                    user.fullName = currentUserLogin.name;
                    user.roles = getRoles(currentUserLogin.roles);
                    user.role = user.roles[0];
                    debugger;
                    let staffInfoPromise = SharedApi.getUserByLoginID(user.loginId);
                    staffInfoPromise.then(
                        function (staffInfo) {
                            if (staffInfo.value && staffInfo.value.length > 0) {
                                user.firstName = staffInfo.value[0].FirstName;
                                user.lastName = staffInfo.value[0].LastSurName;
                                user.employeeID = staffInfo.value[0].EmployeeNumber;
                                user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey,
                                    user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                   
                                    
                                    user.isChoseSchool = true;
                                    if (user.campusID.length > 3){
                                        user.campusID = '001';
                                        user.campusName = 'Austin High School';
                                        //user.isChoseSchool = false;
    
                                    }                                    
									user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
									userProps.user = user;
									resolve(userProps);

									/* let gradeLevelsPromise = SharedApi.getGradeLevelsByCampusCurrentYear(user.campusID);
									gradeLevelsPromise.then(
										function (gradeLevelsInfo) {
											if (gradeLevelsInfo && gradeLevelsInfo.value.length > 0) {
												user.campusGradeLevels = Utilities.sortGradeLevels(gradeLevelsInfo.value);
											}
											else {
												user.campusGradeLevels = [];
											}
										}
									);
									let principalInfoPromise = SharedApi.getPrincipal(user.campusID);
									principalInfoPromise.then(
										function (principalInfo) {
											if (principalInfo && principalInfo.SchoolManagers && principalInfo.SchoolManagers.CILSchoolManager) {
												user.principalEmployeeID = principalInfo.SchoolManagers.CILSchoolManager.StaffNaturalKey;
												user.principalName = principalInfo.SchoolManagers.CILSchoolManager.FirstName + " " + principalInfo.SchoolManagers.CILSchoolManager.LastSurname;
												user.principalLoginID = principalInfo.SchoolManagers.CILSchoolManager.LoginId;
											}
											else {
												user.principalEmployeeID = "";
												user.principalName = "";
												user.principalLoginID = "";
											}
										}
									);
									let cicInfoPromise = AdminApi.getCampusContactsByCampusID(user.campusID);
									cicInfoPromise.then(
										function (cicInfo) {
											if (cicInfo && cicInfo.value.length > 0) {
												user.campusContacts = cicInfo.value;
											}
											else {
												user.campusContacts = [];
											}
										}
									); 
									//let currentSchoolYear = Utilities.getSchoolYear();
									let calRepDatesPromise = MshpApi.getCalendarReportDatesByYear(currentSchoolYear);
									calRepDatesPromise.then(
										function (rptDateInfo) {
											if (rptDateInfo && rptDateInfo.value.length > 0) {
												user.calendarReportDates = rptDateInfo.value;
											}
											else {
												user.calendarReportDates = [];
											}
										  
											user.defaultReportDateID = Utilities.getMostRecentReportDateID(user.calendarReportDates);
										}
									);
	 

										 let campusProfilePromise = AdminApi.getCampusProfileIDForState(user.campusID, currentSchoolYear);
										campusProfilePromise.then(
											function (campusProfileIDInfo) {
												if (campusProfileIDInfo) {
													user.campusProfileID = campusProfileIDInfo;
												}
												else {
													user.campusProfileID = 0;
												}

											}
										); */
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
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                    console.log("error----", error);
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
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
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

    static getUserByLoginID(loginId) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=LoginId eq '" + loginId + "'&$expand=EducationOrganization";
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

    static getPrincipal(campusID) {
        let serviceUrl = Config.REST_URL + "common/odata/EducationOrganizations('" + campusID + "')?$expand=SchoolManagers($expand=CILSchoolManager)";
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
    static getGradeLevelsByCampusCurrentYear(campusID) {
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

    static getNavigationItems(role) {
        return new Promise((resolve, reject) => {
            let menuOptions = [];

            if (role === "Admin") {
                menuOptions = [

                    {
                        name: 'Enrollment', key: 'home', url: '#', icon: 'Add',
                        links: [

                            { name: 'Input', key: 'enrollmentinput', url: '#enrollmentinput', icon: 'Edit' },
                            { name: 'History', key: 'enrollmenthistory', url: '#enrollmenthistory', icon: 'Document' }
                        ],
                        isExpanded: true
                    },

                    {
                        name: 'Campus Profile', key: 'schoolprofile', url: '', icon: 'Document',
                        links: [

                            { name: 'Lookup', key: 'profilelookup', url: '#campusprofile', icon: 'Document' }
                        ],
                        isExpanded: true
                    },

                    {
                        name: 'Calendar', key: 'calendar', url: '', icon: 'Document',
                        links: [
                            { name: 'Calendar Lookup', key: 'calendarlookup', url: '#calendarlookup', icon: 'Document' }
                        ],
                        isExpanded: true
                    },

                    {
                        name: 'Reports', key: 'reports', url: '#reports', icon: '',
                        links: [

                            {
                                name: 'Non Reporting',
                                url: '',
                                key: 'nonreporting',
                                description: ''
                            },
                            {
                                name: 'Detail',
                                url: '',
                                key: 'detail',
                                description: ''
                            },
                            {
                                name: 'Summary',
                                url: '',
                                key: 'summary',
                                description: ''
                            },
                            {
                                name: 'Summary and Detail',
                                url: '',
                                key: 'summarydetail',
                                description: ''
                            }

                        ],
                        isExpanded: false
                    }
                ];
            }
            if (role === "Reports") {
                menuOptions = [
                    {
                        name: 'Reports', key: 'reports', url: '#reports', icon: '',
                        links: [
                            {
                                name: 'Reports', key: 'reports', url: '#reports', icon: '',
                                links: [
                                    {
                                        name: 'Non Reporting',
                                        url: '',
                                        key: 'nonreporting',
                                        description: ''
                                    },
                                    {
                                        name: 'Detail',
                                        url: '',
                                        key: 'detail',
                                        description: ''
                                    },
                                    {
                                        name: 'Summary',
                                        url: '',
                                        key: 'summary',
                                        description: ''
                                    },
                                    {
                                        name: 'Summary and Detail',
                                        url: '',
                                        key: 'summarydetail',
                                        description: ''
                                    }

                                ],
                                isExpanded: true
                            }
                        ],
                        isExpanded: false
                    }

                ];
            }
            if (role === "Campus") {
                menuOptions = [
                    
                    { name: 'Enrollment Input', key: 'enrollmentinput', url: '#enrollmentinput', icon: 'Edit' },

                    { name: 'History', key: 'enrollmenthistory', url: '#enrollmenthistory', icon: 'Document' }

                    ,
                    { name: 'Campus Profile', key: 'schoolprofile', url: '#campusprofile', icon: 'Document' },
                    { name: 'Lookup Results', key: 'lookupresults', url: '', icon: 'Document' },

                    { name: 'Calendar Lookup', key: 'calendarlookup', url: '#Calendar Lookup', icon: 'Document' }
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
