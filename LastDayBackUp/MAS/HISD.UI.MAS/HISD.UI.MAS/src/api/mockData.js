class MockData {
    static getUsers() {
        let users =
            [
                {
                    userName: "AD\p0001",
                    firstName: "Daenerys",
                    lastName: "Targaryen",
                    fullName: "Daenerys Targaryen",
                    employeeID: "0001",
                    role: "Admin",
                    roles: ['Admin', 'Mentor', 'Mentee'],
                    campusID: "017",
                    campusName: "Westbury High School",
                    principalEmployeeID: "0002",
                    principalName: "Jon Snow"
                },
                {
                    userName: "AD\p0002",
                    firstName: "Jon",
                    lastName: "Snow",
                    fullName: "Jon Snow",
                    employeeID: "0002",
                    role: ['Principal', 'Mentor', 'Mentee'],
                    campusID: "3201",
                    campusName: "Westbury High School",
                    principalEmployeeID: "0002",
                    principalName: "Jon Snow"
                },
                {
                    userName: "AD\p0003",
                    firstName: "Ned",
                    lastName: "Stark",
                    fullName: "Ned Stark",
                    employeeID: "0003",
                    role: ["CIC"],
                    campusID: "3201",
                    campusName: "Westbury High School",
                    principalEmployeeID: "0002",
                    principalName: "Jon Snow"
                },
                {
                    userName: "AD\p0004",
                    firstName: "Cercei",
                    lastName: "Lannister",
                    fullName: "Cercei Lannister",
                    employeeID: "0004",
                    role: ["Mentor"],
                    campusID: "3201",
                    campusName: "Westbury High School",
                    principalEmployeeID: "0002",
                    principalName: "Jon Snow"
                },
                {
                    userName: "AD\p0005",
                    firstName: "Tyrion",
                    lastName: "Lannister",
                    fullName: "Tyrion Lannister",
                    employeeID: "0005",
                    role: ["Mentee"],
                    campusID: "3201",
                    campusName: "Westbury High School",
                    principalEmployeeID: "0002",
                    principalName: "Jon Snow"
                }
            ];
        return users;
    }

    static getAppProperties() {
        let appProperties =
            {
                title: "Mentor Activity System",
                siteCollection: "https://connectdevapps.houstonisd.org/",
                RESTUrl: "http://apidev.houstonisd.org/HisdAPI/"

            };
        return appProperties;
    }

    static getMentors() {

        let mentors =
            [
                {
                    userName: "AD\\p0010",
                    employeeID: "0010",
                    firstName: "Petyr",
                    lastName: "Baelish",
                    fullName: "Petyr Baelish",
                    gradeLevel: 12,
                    title: "History Teacher",
                    program: "G/T"
                },
                {
                    userName: "AD\\p0007",
                    employeeID: "0007",
                    firstName: "Khal",
                    lastName: "Drogo",
                    fullName: "Khal Drogo",
                    gradeLevel: 5,
                    title: "Math Teacher",
                    program: "Bilingual"
                },
                {
                    userName: "AD\\p0008",
                    employeeID: "0008",
                    firstName: "Ramsay",
                    lastName: "Bolton",
                    fullName: "Ramsay Bolton",
                    gradeLevel: 12,
                    title: "P.E. Teacher",
                    program: "Special Education"
                },
                {
                    userName: "AD\\p0009",
                    employeeID: "0009",
                    firstName: "Sandor",
                    lastName: "Clegane",
                    fullName: "Sandor Clegane",
                    gradeLevel: 12,
                    title: "Geography Teacher",
                    program: "ESL"
                }
            ];
        return mentors;
    }

    static getMentees() {

        let mentees =
            [
                {
                    userName: "AD\p0006",
                    employeeID: "0006",
                    firstName: "Arya",
                    lastName: "Stark",
                    fullName: "Arya Stark",
                    gradeLevel: 12,
                    title: "English Teacher",
                    program: "ESL"
                },
                {
                    userName: "AD\p0011",
                    employeeID: "0011",
                    firstName: "Sansa",
                    lastName: "Stark",
                    fullName: "Sansa Stark",
                    gradeLevel: 12,
                    title: "Science Teacher",
                    program: "Bilingual"
                },
                {
                    userName: "AD\p0012",
                    employeeID: "0012",
                    firstName: "Jaime",
                    lastName: "Lannister",
                    fullName: "Jaime Lannister",
                    gradeLevel: 12,
                    title: "Music Teacher",
                    program: "G/T"
                },
                {
                    userName: "AD\p0013",
                    employeeID: "0013",
                    firstName: "Theon",
                    lastName: "Grayjoy",
                    fullName: "Theon Grayjoy",
                    gradeLevel: 5,
                    title: "Biology Teacher",
                    program: "ESL"
                }
            ];
        return mentees;
    }

    static getCampuses() {
        let campuses =
            [
                {
                    campusID: "10000437",
                    campusName: "Westbury High School"
                },
                {
                    campusID: "104",
                    campusName: "Almeda Elementary"
                }
            ];
        return campuses;
    }

    static getRelationships() {
        let relationships =
            [
                {
                    id: "1",
                    mentorEmployeeID: "0010",
                    mentorName: "Petyr Baelish",
                    menteeEmployeeID: "0011",
                    menteeName: "Sansa Stark",
                    year: "Year 1",
                    relationshipStatus: "Active",
                    principalApproval: "Accepted",
                    mentorAgreement: "Pending"
                },
                {
                    id: "2",
                    mentorEmployeeID: "0008",
                    mentorName: "Ramsay Bolton",
                    menteeEmployeeID: "0013",
                    menteeName: "Theon Grayjoy",
                    year: "Year 1",
                    relationshipStatus: "Inactive",
                    principalApproval: "Accepted",
                    mentorAgreement: "Accepted"
                },
                {
                    id: "3",
                    mentorEmployeeID: "0009",
                    mentorName: "Sandor Clegane",
                    menteeEmployeeID: "0006",
                    menteeName: "Arya Stark",
                    year: "Year 2",
                    relationshipStatus: "Active",
                    principalApproval: "Accepted",
                    mentorAgreement: "Pending"
                },
                {
                    id: "4",
                    mentorEmployeeID: "0007",
                    mentorName: "Khal Drogo",
                    menteeEmployeeID: "0012",
                    menteeName: "Jamie Lannister",
                    year: "",
                    relationshipStatus: "Active",
                    principalApproval: "Accepted",
                    mentorAgreement: "Accepted"
                }
            ];
        return relationships;
    }

    static getActivityLog(){
        let activityLog = [
            {
                    id: "1",
                    activityDate: "08/01/2017",
                    activityCode: "CONF",
                    timeSpent: "01:30",
                    communicationType: "Mentee",
                    menteesAndAttendees: "Arya Stark",
                    mentorVerification: "Yes",
                    mentorName: "Petyr Baelish"
            },
            {
                    id: "2",
                    activityDate: "08/02/2017",
                    activityCode: "CONF",
                    timeSpent: "02:00",
                    communicationType: "Mentee",
                    menteesAndAttendees: "Sansa Stark",
                    mentorVerification: "Pending",
                    mentorName: "Petyr Baelish"
            },
            {
                    id: "3",
                    activityDate: "08/03/2017",
                    activityCode: "CONF",
                    timeSpent: "00:30",
                    communicationType: "Mentee",
                    menteesAndAttendees: "Theon Grayjoy",
                    mentorVerification: "No",
                    mentorName: "Ramsay Bolton"
            },
            {
                    id: "4",
                    activityDate: "08/04/2017",
                    activityCode: "CONF",
                    timeSpent: "01:00",
                    communicationType: "Mentee",
                    menteesAndAttendees: "John Snow",
                    mentorVerification: "Pending",
                    mentorName: "Sandor Clegane"
            },
            {
                    id: "5",
                    activityDate: "08/05/2017",
                    activityCode: "CONF",
                    timeSpent: "02:00",
                    communicationType: "Mentee",
                    menteesAndAttendees: "Rob Stark",
                    mentorVerification: "No",
                    mentorName: "Ramsay Bolton"
            }
        ];
        return activityLog;
    }

    static getTimeConfigs(){
        let timeConfigs = [
            {
                id: "3",
                startYear: "2017",
                endYear: "2018",
                startDate: "08/22/2017",
                endDate: "06/04/2018",
                inactiveDate: "06/03/2018"
            }
        ];
        return timeConfigs;
    }

    static getActivityCodes(){
        let activityCodes = [
            {
             id: "1",
             code: "ABS",
             description: "Article/Book Study",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "2",
             code: "ADM",
             description: "Communication with Administrator or Instructional team (CLM, Region Specialist, Lit Coach, etc.)",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "3",
             code: "ASW",
             description: "Analysis of Student Work or data",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "4",
             code: "CONF",
             description: "Conference with NT (pre-, post-OBS, reflective, goal-setting, CAL, post-MENOb, parent, etc.)",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "5",
             code: "EAFD",
             description: "Extended Absence From Duty not requiring mentor change (i.e. maternity leave)",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "6",
             code: "TRG",
             description: "Presenting or co-presenting a training session",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "7",
             code: "EXP",
             description: "Expert/Shadow day",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "8",
             code: "IPREP",
             description: "Individual planning, preparation, organization, communication time",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "9",
             code: "LC",
             description: "Learning Community activity",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "10",
             code: "OBS",
             description: "Mentor observing New Teacher – formal, informal, walkthrough, ACP/ACT, etc.",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "11",
             code: "PLAN",
             description: "Planning with NT – lesson, assessment, content/pedagogy knowledge development, gathering resources",
             mentorType: "All",
             status: "Active"
            },
            {
             id: "12",
             code: "TLAC PD",
             description: "TLAC coach leading Professional Development for campus teachers",
             mentorType: "All",
             status: "Active"
            }
        ];
        return activityCodes;
    }

    static getCBMStandards(){
        let cbmStandards = [
            {id: 1, month: 'January', logs: 4},
            {id: 2, month: 'February', logs: 4},
            {id: 3, month: 'March', logs: 3},
            {id: 4, month: 'April', logs: 4},
            {id: 5, month: 'May', logs: 4},
            {id: 6, month: 'June', logs: 0},
            {id: 7, month: 'July', logs: 0},
            {id: 8, month: 'August', logs: 0},
            {id: 9, month: 'September', logs: 1},
            {id: 10, month: 'October', logs: 4},
            {id: 11, month: 'November', logs: 3},
            {id: 12, month: 'December', logs: 2}
        ];
        return cbmStandards;
    }
}

export default MockData;