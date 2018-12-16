const newLocal = [];
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
            timeConfigurationID: 0
        },
        homePage: {
            type: "",
            content: null
        },
        schoolYearDescription: ''
    },
    menuOptions: [],
    appProps: { title: "", siteCollection: "" },
    campuses: [],
    centralOffices: [],
    candidateSearchCO: [],
    candidateSearchCampuses: [],
    payGrades: {},
    ajaxCallsInProgress: 0,
    errorMsg: '',
    votingSettings: [],
    candidateNominees: [],
    locations: [],
    candidateTypes: [],
    voteEligibility: {
        eligible: '',
        campusName: '',
        campusType: ''
    },
    castVotes: []
};
