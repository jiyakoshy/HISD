import Config from './config';
import AdminApi from './adminApi';
import RelationshipsApi from './relationshipsApi'

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getRoles(allRoles) {
    let isAdmin = false;
    let isPrincipal = false;
    let isCIC = false;
    let isMentor = false;
    let isMentee = false;
    let roles = [];
    allRoles.forEach(function (item) {
        if (item == 'MAS_Admin')
            isAdmin = true;
        else if (item == 'MAS_CIC')
            isCIC = true;
        else if (item == 'MAS_Mentor')
            isMentor = true;
        else if (item == 'Principal')
            isPrincipal = true;
        else if (item == 'Teacher')
            isMentee = true;
            //isMentor = true;
    });
    if (isAdmin === true) roles.push('Admin');
    if (isPrincipal === true) roles.push('Principal');
    if (isCIC === true) roles.push('CIC');
    if (isMentor === true) roles.push('Mentor');
    if (isMentee === true && (isAdmin === true || isPrincipal === true || isCIC === true || isMentor === false)) roles.push('Mentee');
   
    if (roles.length <= 0) roles.push('No Access');
    return roles;
}

function checkIfMentor(mentorID, timeConfigID) {

}

class SharedApi {
    // custom login
    static getCustomUserProperties(userID) {
        return new Promise((resolve, reject) => {
            let userProps = {};
            let user = { firstName: '', lastName: '', fullName: '', employeeID: '', role: '', roles: [], campusID: '', campusName: '' };
            let timeConfigPromise = AdminApi.getCurrentTimeConfig();
            timeConfigPromise.then(timeConfig => {
                if (timeConfig.value != null && timeConfig.value.length > 0) {
                    userProps.timeConfigurationID = timeConfig.value[0].TimeConfigurationID;
                    userProps.LogStartDate = timeConfig.value[0].LogStartDate;
                    userProps.LogEndDate = timeConfig.value[0].LogEndDate;

                }
                let currentLoginPromise = this.getCustomCurrentUserLogin(userID);
                currentLoginPromise.then(
                    function (currentUserLogin) {
                        user.loginId = currentUserLogin.loginName.replace('AD\\', ''); //"LTURNER1" ;
                        user.roles = getRoles(currentUserLogin.roles); //["Mentor"];
                        user.role = user.roles[0]; //"Mentor"; 
                        let staffInfoPromise = SharedApi.getUserByLoginID(user.loginId);
                        staffInfoPromise.then(
                            function (staffInfo) {
                                if (staffInfo.value && staffInfo.value.length > 0) {
                                    user.firstName = staffInfo.value[0].FirstName;
                                    user.lastName = staffInfo.value[0].LastSurname;
                                    user.fullName = staffInfo.value[0].FirstName + " " + staffInfo.value[0].LastSurname;
                                    user.employeeID = staffInfo.value[0].EmployeeNumber;
                                    user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey,
                                        user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
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

                                }
                                let checkIfMentorPromise = RelationshipsApi.getRelationshipByMentorIDandTimeConfig(user.staffNaturalKey, userProps.timeConfigurationID);
                                let isMentor = false;
                                checkIfMentorPromise.then(checkMentor => {
                                    if (checkMentor.value.length > 0) {
                                        isMentor = true;
                                    }
                                    if (isMentor)
                                        currentUserLogin.roles.push('MAS_Mentor');
                                    user.roles = [];
                                    user.role = '';
                                    user.roles = getRoles(currentUserLogin.roles);
                                    user.role = user.roles[0]; //"Mentor"; 
                                    userProps.user = user;
                                    resolve(userProps);
                                });

                            }
                        );
                    });
            });
        });
    }

    static getUserProperties() {
        return new Promise((resolve, reject) => {
            let userProps = {};
            let user = { firstName: '', lastName: '', fullName: '', employeeID: '', staffNaturalKey: '', role: '', roles: [], campusID: '', campusName: '' };
            let timeConfigPromise = AdminApi.getCurrentTimeConfig();
            timeConfigPromise.then(timeConfig => {
                if (timeConfig.value != null && timeConfig.value.length > 0) {
                    userProps.timeConfigurationID = timeConfig.value[0].TimeConfigurationID;
                    userProps.LogStartDate = timeConfig.value[0].LogStartDate;
                    userProps.LogEndDate = timeConfig.value[0].LogEndDate;

                }
                let currentLoginPromise = this.getCurrentUserLogin();
                currentLoginPromise.then(
                    function (currentUserLogin) {
                        user.loginId = currentUserLogin.loginName.replace('AD\\', ''); //"LTURNER1" ;
                        //user.loginId = "P00118794" ; //currentUserLogin.loginName.replace('AD\\', ''); 
                        //["Admin", "Principal", "CIC", "Mentor", "Mentee"]; 
                        user.roles = getRoles(currentUserLogin.roles); //["Mentor"];
                        user.role = user.roles[0]; //"Mentor"; 
                        let staffInfoPromise = SharedApi.getUserByLoginID(user.loginId);
                        staffInfoPromise.then(
                            function (staffInfo) {
                                if (staffInfo.value && staffInfo.value.length > 0) {
                                    user.firstName = staffInfo.value[0].FirstName;
                                    user.lastName = staffInfo.value[0].LastSurname;
                                    user.fullName = staffInfo.value[0].FirstName + " " + staffInfo.value[0].LastSurname;
                                    user.employeeID = staffInfo.value[0].EmployeeNumber;
                                    user.staffNaturalKey = staffInfo.value[0].StaffNaturalKey,
                                        user.campusID = staffInfo.value[0].EducationOrgNaturalKey;
                                    user.campusName = staffInfo.value[0].EducationOrganization.NameOfInstitution;
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

                                }
                                let checkIfMentorPromise = RelationshipsApi.getRelationshipByMentorIDandTimeConfig(user.staffNaturalKey, userProps.timeConfigurationID);
                                let isMentor = false;
                                checkIfMentorPromise.then(checkMentor => {
                                    if (checkMentor.value.length > 0) {
                                        isMentor = true;
                                    }
                                    if (isMentor)
                                        currentUserLogin.roles.push('MAS_Mentor');
                                    user.roles = [];
                                    user.role = '';
                                    user.roles = getRoles(currentUserLogin.roles);
                                    user.role = user.roles[0]; //"Mentor"; 
                                    userProps.user = user;
                                    resolve(userProps);
                                });
                            }
                        );
                    });
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
        //loginId = "LTURNER1";
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=(LoginId eq '" + loginId + "' and StaffActiveIndicator eq true)&$expand=EducationOrganization";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :Config.Headers 
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
                credentials: 'include',
                headers :Config.Headers 
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    static sendEmail(email) {
        let serviceUrl = Config.REST_URL + Config.SERVICESTART + "/odata/SendEmailCIC";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(email),
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

    static getStaffFromStaffNaturalKey(queryOptions) {
        let serviceUrl =Config.REST_URL + "common/odata/Staffs?$select=FirstName,LastSurname,MiddleName,LatestHireDate,StaffNaturalKey,EmployeeNumber&$expand=StaffElectronicEmail,JobCode&$filter=(" + queryOptions + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers :Config.Headers 
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
                    { name: 'Home', key: 'home', url: '#', icon: 'Add' },
                    { name: 'Mentor Profiles', key: 'mentors', url: '#mentors', icon: 'Document' },
                    { name: 'Mentee Relationships', key: 'mentees', url: '#mentees', icon: 'Person' },
                    { name: 'Mentor/Mentee Relationships', key: 'relationships', url: '#relationships', icon: 'supervisor account' },
                    { name: 'Activity Logs', key: 'activitylogs', url: '#activitylogs', icon: 'Edit' },
                    {
                        name: 'Reports', key: 'reports', url: '#reports', icon: '',
                        links: [
                            {
                                name: 'Activity Total',
                                url: '#reports-activitytotal',
                                key: 'activitytotals',
                                description: 'Displays the total number of hours spent by mentors for each school office.'
                            },
                            {
                                name: 'Mentor Activity Log',
                                url: '#reports-mentorlogs',
                                key: 'mentorlogs',
                                description: 'Displays details of all the activities entered by the mentors.'
                            },
                            {
                                name: 'Mentor Completion',
                                url: '#reports-mentorcompletion',
                                key: 'mentorcompletion',
                                description: 'Tells if a mentor has completed the required number of logs.'
                            },
                            {
                                name: 'Verif. Standards & Tools',
                                url: '#reports-verification',
                                key: 'verificationstandards',
                                description: 'Displays the details of the activities verified or not by the mentees.'
                            },
                            {
                                name: 'Mentor/Mentee Demographic',
                                url: '#reports-demographic',
                                key: 'demographicreport',
                                description: 'Displays the demographic details of all the mentor/mentee relationship for the district.'
                            }
                        ],
                        isExpanded: false
                    },
                    {
                        name: 'Admin', key: 'admin', url: '#admin', icon: '',
                        links: [
                            {
                                name: 'Activity Codes',
                                url: '#admin-activitycodes',
                                key: 'activitycodes',
                                description: 'Allows to add, modify or delete activity codes.'
                            },
                            {
                                name: 'Time Configuration',
                                url: '#admin-timeconfig',
                                key: 'timeconfig',
                                description: 'Allows to add, modify or delete time configuration records. '
                            },
                            {
                                name: 'CBM Standards',
                                url: '#admin-cbmstandards',
                                key: 'cbmstandards',
                                description: 'Allows to add, modify or delete CBM Standard records.'
                            },
                            {
                                name: 'Site Content',
                                url: '#admin-sitecontent',
                                key: 'sitecontent',
                                description: 'Allows to add, modify or delete site content records.'
                            },
                            {
                                name: 'CIC',
                                url: '#admin-campuscontacts',
                                key: 'campuscontacts',
                                description: 'Allows to add or delete CIC.'
                            },
                            {
                                name: 'Home Messages',
                                url: '#admin-homemessages',
                                key: 'homemessages',
                                description: 'Allows to add, modify or delete home page message for the different roles.'
                            },
                            /*{
                                name: 'Mentees End Dates',
                                url: '#admin-menteesenddates',
                                key: 'menteesenddates',
                                description: 'Displays the mentees end dates.' dfdfdfd
                            },*/
                            {
                                name: 'Verification Codes',
                                url: '#admin-verificationcodes',
                                key: 'verificationcodes',
                                description: 'Allows to add or delete Activity Log Verification Codes.'
                            },
                            {
                                name: 'Instructional Practice - Planning Standards',
                                url: '#/admin-instructionplanning',
                                key: '',
                                description: 'Allows to add or edit IP Standards for Activity Logs.'
                            },
                            {
                                name: 'Instructional Practice - Instruction Standards',
                                url: '#/admin-instructionalInstruction',
                                key: '',
                                description: 'Allows to add or edit IP Standards for Activity Logs.'
                            },
                            {
                                name: 'Professional Expectation Standards',
                                url: '#admin-professionalexpectation',
                                key: '',
                                description: 'Allows to add or edit PE Standards for Activity Logs.'
                            }
                        ],
                        isExpanded: false
                    }

                ];
            }
            if (role === "Principal") {
                menuOptions = [
                    { name: 'Home', key: 'principalhome', url: '#', icon: '' },
                    { name: 'Mentor Profiles', key: 'mentors', url: '#mentors', icon: '' },
                    { name: 'Mentee Relationships', key: 'mentees', url: '#mentees', icon: '' },
                    { name: 'Mentor/Mentee Relationships', key: 'relationships', url: '#relationships', icon: '' },
                    { name: 'CIC', url: '#campuscontacts', key: 'campuscontacts', icon: '' },
                    //{ name: 'Mentees End Dates', url: '#menteesenddates', key: 'menteesenddates', icon: ''},
                    { name: 'Activity Logs', key: 'activity-logs', url: '#activitylogs', icon: '' },
                    {
                        name: 'Reports', key: 'reports', url: '#reports', icon: '',
                        links: [
                            {
                                name: 'Mentor Activity Log',
                                url: '#reports-mentorlogs',
                                key: 'mentorlog',
                                description: 'Displays details of all the activities entered by the mentors.'
                            },
                            {
                                name: 'Mentor Completion',
                                url: '#reports-mentorcompletion',
                                key: 'mentorcompletion',
                                description: 'Tells if a mentor has completed the required number of logs.'
                            },
                            {
                                name: 'Verif. Standards & Tools',
                                url: '#reports-verification',
                                key: 'verificationstandards',
                                description: 'Displays the details of the activities verified or not by the mentees.'
                            }
                        ],
                        isExpanded: false
                    }
                ];
            }
            else if (role === "CIC") {
                menuOptions = [
                    { name: 'Home', key: 'cichome', url: '#', icon: '' },
                    { name: 'Mentor Profiles', key: 'mentors', url: '#mentors', icon: '' },
                    { name: 'Mentee Relationships', key: 'mentees', url: '#mentees', icon: '' },
                    { name: 'Mentor/Mentee Relationships', key: 'relationships', url: '#relationships', icon: '' },
                    { name: 'Activity Logs', key: 'activity-logs', url: '#activitylogs', icon: '' },
                    //{ name: 'CIC', url: '#campuscontacts', key: 'campuscontacts', icon: ''},
                    {
                        name: 'Reports', key: 'reports', url: '#reports', icon: '',
                        links: [
                            {
                                name: 'Mentor Activity Log',
                                url: '#reports-mentorlogs',
                                key: 'mentorlog',
                                description: 'Displays details of all the activities entered by the mentors.'
                            },
                            {
                                name: 'Mentor Completion Report',
                                url: '#reports-mentorcompletion',
                                key: 'mentorcompletion',
                                description: 'Tells if a mentor has completed the required number of logs.'
                            },
                            {
                                name: 'Verif. Standards & Tools',
                                url: '#reports-verification',
                                key: 'verificationstandards',
                                description: 'Displays the details of the activities verified or not by the mentees.'
                            }
                        ],
                        isExpanded: false
                    }
                ];
            }
            else if (role === "Mentor") {
                menuOptions = [
                    { name: 'Home', key: 'mentorhome', url: '#', icon: '' },
                    { name: 'Mentee Relationships', key: 'mentees', url: '#mentees', icon: '' },
                    //{ name: 'Mentor/Mentee Relationships', key: 'relationships', url: '#relationships', icon: '' },
                    { name: 'Activity Logs', key: 'activitylogs', url: '#activitylogs', icon: '' },
                    {
                        name: 'Reports', key: 'reports', url: '#reports', icon: '',
                        links: [
                            {
                                name: 'Mentor Activity Log',
                                url: '#reports-mentorlogs',
                                key: 'mentorlog',
                                description: 'Displays details of all the activities entered by the mentors.'
                            },
                            {
                                name: 'Mentor Completion Report',
                                url: '#reports-mentorcompletion',
                                key: 'mentorcompletion',
                                description: 'Tells if a mentor has completed the required number of logs.'
                            }
                        ],
                        isExpanded: false
                    }
                ];
            }
            else if (role === "Mentee") {
                menuOptions = [
                    { name: 'Home', key: 'menteehome', url: '#', icon: '' },
                    { name: 'Activity Logs', key: 'activitylogsmentee', url: '#activitylogsmentee', icon: '' }
                ];
            }

            //custom login
            if (Config.SHOW_LOGIN) {
                menuOptions = [...menuOptions, { name: 'Login', key: 'login', url: '#login', icon: 'Login' }];
            }

            resolve(menuOptions);
        });
    }
}

export default SharedApi;
