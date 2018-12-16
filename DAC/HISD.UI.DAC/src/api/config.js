let Config = {};

Config.SITE_COLLECTION =window._spPageContextInfo.SITE_COLLECTION; // process.env.SITE_COLLECTION;
Config.REST_URL = window._spPageContextInfo.REST_URL; //process.env.REST_URL;
Config.SHOW_LOGIN = window._spPageContextInfo.SHOW_LOGIN; //process.env.REST_URL;

let headers = { 
    'Content-Type': 'application/json', 
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*' 
};
Config.HEADERS = headers;

Config.NONIT_CANDIDATES=[
    {"PayGradeLevel":"25", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"26", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"27", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"28", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"29", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"30", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"31", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"32", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"33", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"34", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"35", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"36", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"37", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"A", "JobFamilyNaturalKey" : ""},
    {"PayGradeLevel":"B", "JobFamilyNaturalKey" : ""}
];

Config.IT_CANDIDATES=[
    {"PayGradeLevel":"06", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"07", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"08", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"09", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"10", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"11", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"12", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"13", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"14", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"15", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"16", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"17", "JobFamilyNaturalKey" : "INFO TECH"},
    {"PayGradeLevel":"06", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"07", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"08", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"09", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"10", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"11", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"12", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"13", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"14", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"15", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"16", "JobFamilyNaturalKey" : "CUST SRVS"},
    {"PayGradeLevel":"17", "JobFamilyNaturalKey" : "CUST SRVS"}
];

Config.ClassroomTeacher ='Classroom Teacher';
Config.CampusBasedProfessional ='Campus Based Professional';
Config.ITCentralOfficeProfessional ='IT Central Office Professional';
Config.NonITCentralOfficeProfessional ='Non IT Central Office Professional';
Config.CentralOfficeProfessional ='Central Office Professional';

export default Config;