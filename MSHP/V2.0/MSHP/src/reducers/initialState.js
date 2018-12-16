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
            campusGradeLevels: [],
            defaultReportDateID: "",
            campusProfileID: 0,
            isChoseSchool: true
        },
        homePage: {
            type: "",
            content: null
        }
    },
    menuOptions: [],
    appProps: { title: "", siteCollection: "" },
    campuses: [],
    ajaxCallsInProgress: 0,
    errorMsg: '',
    nonreportingschool: [],
    reportDates: [],
    enrollments: [],
    enrollmentsHistory: [],
    enrollment: {},
    gradeLevels: [],
    campusProfile: {},
    schoolYears: [],
    summaryreport:[],
    detailreport:[],
    summarydetailreport:[],
    schoolYear: '',
    calendarReportDates: [],
    regionTotalsByGrade: [],
    annualsetup: [],
    calendars:[]
};
