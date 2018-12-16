import Config from './config';
import Utilities from '../utilities/utilities';

class enrollmentApi {
    static getEnrollmentHistory(SchoolYear, CampusId) {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetEnrollmentDataByCampus(SchoolYear='"+ SchoolYear +"',CampusNumber='" + CampusId + "')";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getSchoolYears() {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetSchoolYearDropdownList()";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getSchoolYear() {
        let serviceUrl = Config.REST_URL + "MSHP/odata/GetCurrentSchoolYear()";
        return new Promise((resolve, reject) => {
            fetch( serviceUrl, { 
                method: "get",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getEnrollments(campusID, schoolYear) {
        return new Promise((resolve, reject) => {
            //let hasEnrollments = {};//will have a value prop that holds enrollments array
            let enrollments = [];

            let calendarIDPromise = enrollmentApi.getCalendarID(schoolYear);
            calendarIDPromise.then(
                function (calendarInfo) {
                    let calendarID = calendarInfo.value[0].Id;
                    if (campusID.length > 3)  campusID = '001';
                    let profileIDPromise = enrollmentApi.getCampusProfileID(campusID, calendarID);
                    profileIDPromise.then(
                        function (profileInfo) {
                            if (profileInfo) {
                                let campusProfileID = profileInfo.value[0].Id;

                                let enrollmentsPromise = enrollmentApi.getEnrollmentsByProfileID(campusProfileID);
                                enrollmentsPromise.then(
                                    function (enrollmentsInfo) {
                                        if (enrollmentsInfo && enrollmentsInfo.value.length > 0) {
                                            enrollments = enrollmentsInfo.value;
                                        }
                                        else {
                                            enrollments = [];
                                        }
                                        resolve(enrollments);
                                    }
                                );

                            }
                        }
                    );
                });
        });
    }

    static getEnrollmentData(schoolYear, campusNumber, compareDaySeq){
        let serviceUrl = Config.REST_URL + "mshp/odata/GetEnrollmentData(SchoolYear='" + schoolYear + "', CampusNumber='"  + campusNumber + "',CompareDaySeq=" + compareDaySeq + ")";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getOneEnrollmentRow(campusProfileID, calendarID) {
        return new Promise((resolve, reject) => {
            let enrollment = {};
            let enrollmentPromise = enrollmentApi.getEnrollmentByProfileIDCalendarID(campusProfileID, calendarID);
            enrollmentPromise.then(
                function (enrollmentInfo) {
                    if (enrollmentInfo && enrollmentInfo.value.length > 0) {
                        enrollment = enrollmentInfo.value;
                    }
                    else {
                        enrollment = {};
                    }
                    resolve(enrollment);
            });

        });
    }

    static getEnrollmentByProfileIDCalendarID(campusProfileID, calendarID) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=CampusProfileId eq " + campusProfileID + " and CalendarId eq " + calendarID + "'&$top=1";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getEnrollmentsByProfileID(profileID) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=CampusProfileId eq " + profileID + "&$expand=Calendar";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getCalendarID(schoolYear) {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar?$filter=(SchoolYear eq '" + schoolYear + "' and CompareDaySeq eq 1)&$select=Id";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getGradeLevelsByCampusAndYear(campusID, schoolYearEnd) {
        let serviceUrl = Config.REST_URL + "common/odata/SchoolGradeLevelAssociations?$filter=(EducationOrgNaturalKey eq '" + campusID + "' and SchoolYearNaturalKey eq  '" + schoolYearEnd + "')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getCalendarReportDates() {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar?$filter=(indexof(PlanNotes,'aiver') le 0 and ReportDate ne null)&$select=SchoolYear,CompareDaySeq,ReportDate,Id,InstructionDay&orderby=Id";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getCalendarReportDatesByYear(schoolYear) {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar?$filter=(indexof(PlanNotes,'aiver') le 0 and SchoolYear eq '" + schoolYear + "' and ReportDate ne null)&$select=SchoolYear,CompareDaySeq,ReportDate,Id,InstructionDay,PlanNotes&orderby=CompareDaySeq";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getCampusProfileIDForState(campusID, schoolYear) {
        return new Promise((resolve, reject) => {
            let calendarIDPromise = enrollmentApi.getCalendarID(schoolYear);
            calendarIDPromise.then(
                function (calendarInfo) {
                    let calendarID = calendarInfo.value[0].Id;
                    if (campusID.length > 3) campusID = '001';
                        
                    let profileIDPromise = enrollmentApi.getCampusProfileID(campusID, calendarID);
                    profileIDPromise.then(
                        function (profileInfo) {
                            if (profileInfo) {
                                let campusProfileID = profileInfo.value[0].Id;

                                resolve(campusProfileID);
                            }
                        }
                    );
                });
        });
    }

    static getCampusProfileID(campusID, calendarID) {

        const calendarIDint = parseInt(calendarID);
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CalendarId eq " + calendarIDint + " and CampusNumber eq '" + campusID + "')&$select=Id";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

    static getProfile(campusID, schoolYear) {
        return new Promise((resolve, reject) => {
            let campusProfile = {};
            let calendarID = null;
            let calendarIDPromise = enrollmentApi.getCalendarID(schoolYear);
            calendarIDPromise.then(
                function (calendarInfo) {
                    if (calendarInfo)
                    calendarID = calendarInfo.value[0].Id;//this is the calID for CompareDaySeq=1 since CampusProfile only has that calID
                    if (campusID.length > 3)  campusID = '001';
                    let profilePromise = enrollmentApi.getCampusProfile(campusID, calendarID);
                    profilePromise.then(
                        function (profileInfo) {
                            if (profileInfo && profileInfo.value.length > 0) {

                                campusProfile.campusProfileID = profileInfo.value[0].Id;
                                campusProfile.schoolYear = schoolYear;///// FROM ABOVE
                                campusProfile.calendarID = profileInfo.value[0].CalendarId;
                                campusProfile.organizationGroupID = profileInfo.value[0].OrganizationGroupId;
                                campusProfile.description = profileInfo.value[0].OrganizationGroup.Description;
                                campusProfile.campusNumber = profileInfo.value[0].CampusNumber;

                                campusProfile.capacity = profileInfo.value[0].Capacity;
                                campusProfile.projection = profileInfo.value[0].Projection;
                                campusProfile.snapshot = profileInfo.value[0].Snapshot;
                                campusProfile.createdDate = profileInfo.value[0].CreatedDate;
                                campusProfile.createdBy = profileInfo.value[0].CreatedBy;
                                campusProfile.updatedDate = profileInfo.value[0].UpdatedDate;
                                campusProfile.updatedBy = profileInfo.value[0].UpdatedBy;
                            }
                            else {
                                campusProfile = {};
                            }
                            resolve(campusProfile);
                        }
                    );

                }
            );
        }
        );
    }
    static getCampusProfile(campusID, calendarID) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CalendarId eq " + calendarID + " and CampusNumber eq '" + campusID + "')&$expand=OrganizationGroup";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'AppID': 'MSHP'
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

export default enrollmentApi;
