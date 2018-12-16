export default {
    userProps: {
        user: {
            userName: "",
            firstName: "",
            lastName: "",
            fullName: "",
            employeeID: "",
            staffNaturalKey: "",
            role: "",
            roles: [],
            campusID: "",
            campusName: "",
            timeConfigurationID: 0,
            currentYear:""
        },
        homePage: {
            type: "",
            content: null
        }
    },
    menuOptions: [],
    appProps: { title: "", siteCollection: "" },
    campusesProps:{},
    waivers:{waiversCheckList : []},
    campuses: [],
    adminProps:{},
    generalWaiversProps:{},
    customWaiversProps:{},
    ajaxCallsInProgress: 0,
    errorMsg: '',
    waiverRequests : {
        list : [],
        customWaivers : []
    },
    adminDashboard: {},
    homeMessages: [],
    homeMessage: {}
};
