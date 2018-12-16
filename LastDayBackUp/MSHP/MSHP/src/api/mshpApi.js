import Config from './config';
import Utilities from '../utilities/utilities';

class MshpApi {

    //new 6/26
    static getSummaryReport(schoolYear, compareDaySeq ){
        ////http://apidev.houstonisd.org/mshp/odata/GetSummaryReport(SchoolYear='2017-2018',CompareDaySeq=22)?$orderby=LevelGroupID
        let serviceUrl = Config.REST_URL + "mshp/odata/GetSummaryReport(SchoolYear='" + schoolYear + "',CompareDaySeq=" + compareDaySeq + "?$orderby=LevelGroupID";
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
    
    //new 6/25
    static getEnrollmentByCampusEnrollmentID(campusEnrollmentID) {
        //Using a 'querystring', this API method enables the history page to request an Enrollment
        // using simply the campusEnrollmentID.
        // I added CampusProfile in case any of that data is needed like campus#.. from that the name can be looked up if needed
        //http://apidev.houstonisd.org/mshp/odata/CampusEnrollment?$filter=Id%20eq%20122003&$expand=CampusProfile
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=Id eq " + campusEnrollmentID + "&$expand=CampusProfile";
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
	

    //new 6/1
    static createCampusEnrollment(enrollment) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "POST",
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(enrollment),
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    console.log("Gary response----", response);
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    //05/24 new
    static updateEnrollment(enrollment) {
        //difficulty here is that enrollment passed in must have Id rather than CampusEnrollmentID due to service design
        //expect enrollment properties to be at least CampusEnrollmentID, UpdatedBy, some combination of integer counts for Grade Level(s) edited
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment(" + enrollment.Id + ")";

        //let changes = {Id: 29305, IEE: 50, IPK: 50, IKG: 50, I01: 50 , I02: 50, I03: 50, I04: 50, I05: 50, Total: 999, UpdatedBy: 'Gary Marks', UpdatedDate:"2018-02-23" };

        let preview = JSON.stringify(enrollment);
        //CampusEnrollmentID, CampusProfileID, CalendarID, IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total, CreatedDate, CreatedBy, UpdatedDate, UpdatedBy
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(enrollment),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    console.log("response------", response);
                    resolve(response);

                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
//new 6/22
    static updateCampusProfile(campusProfile) {
        //difficulty here is that enrollment passed in must have Id rather than CampusEnrollmentID due to service design
        //expect enrollment properties to be at least CampusEnrollmentID, UpdatedBy, some combination of integer counts for Grade Level(s) edited
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile(" + campusProfile.Id + ")";

        //let changes = {Id: 29305, IEE: 50, IPK: 50, IKG: 50, I01: 50 , I02: 50, I03: 50, I04: 50, I05: 50, Total: 999, UpdatedBy: 'Gary Marks', UpdatedDate:"2018-02-23" };

        let preview = JSON.stringify(campusProfile);
        //CampusEnrollmentID, CampusProfileID, CalendarID, IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total, CreatedDate, CreatedBy, UpdatedDate, UpdatedBy
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: "PATCH",
                mode: 'cors',
                body: JSON.stringify(campusProfile),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    console.log("response------", response);
                    resolve(response);

                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    static getStaffnameByLogin(loginID) {
        let serviceUrl = Config.REST_URL + "common/odata/Staffs?$filter=(LoginId eq '" + loginID + "')&$select=FirstName,LastSurname";
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

    static getCalendarReportDatesByYear(schoolYear) {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar?$filter=(indexof(PlanNotes,'aiver') le 0 and SchoolYear eq '" + schoolYear + "' and ReportDate ne null)&$select=SchoolYear,CompareDaySeq,ReportDate,Id,InstructionDay&orderby=CompareDaySeq";
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
    static getCalendarReportDates() {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar?$filter=(indexof(PlanNotes,'aiver') le 0  and ReportDate ne null)&$select=SchoolYear,CompareDaySeq,ReportDate,Id,InstructionDay&orderby=Id";
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

    static getGradeLevelsByCampusAndYear(campusID, schoolYearEnd) {
        console.log('Jibin campusID---',campusID);
        //https://apidev.houstonisd.org/common/odata/common/odata/SchoolGradeLevelAssociations?$filter=(EducationOrgNaturalKey eq '108' and SchoolYearNaturalKey eq '018')
        console.log('Jibin schoolYearEnd---',schoolYearEnd);
        let serviceUrl = Config.REST_URL + "common/odata/SchoolGradeLevelAssociations?$filter=(EducationOrgNaturalKey eq '" + campusID + "' and SchoolYearNaturalKey eq  '" + schoolYearEnd + "')";
        return new Promise((resolve, reject) => {
            fetch(serviceUrl, {
                method: 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {'AppID': 'MSHP'}
            })
                .then(function (response) {
                    resolve(response.json());
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }






    //only the REST call, requires campusProfileID and calendarID
    static getEnrollmentsByCalendarAndProfile(profileID, calendarID) {
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=CalendarId eq " + calendarID + " and CampusProfileId eq " + profileID;
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

    // new 5/20
    static getEnrollments(campusID, schoolYear) {
        return new Promise((resolve, reject) => {
            //let hasEnrollments = {};//will have a value prop that holds enrollments array
            let enrollments = [];

            let calendarIDPromise = MshpApi.getCalendarID(schoolYear);
            calendarIDPromise.then(
                function (calendarInfo) {
                    let calendarID = calendarInfo.value[0].Id;
                    if (campusID.length > 3)  campusID = '001';
                    let profileIDPromise = MshpApi.getCampusProfileID(campusID, calendarID);
                    profileIDPromise.then(
                        function (profileInfo) {
                            if (profileInfo) {
                                let campusProfileID = profileInfo.value[0].Id;

                                let enrollmentsPromise = MshpApi.getEnrollmentsByProfileID(campusProfileID);
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
    //6/22
    static getEnrollmentData(schoolYear, campusNumber, compareDaySeq){
        let serviceUrl = Config.REST_URL + "mshp/odata/GetEnrollmentData(SchoolYear='" + schoolYear + "', CampusNumber='"  + campusNumber + "',CompareDaySeq=" + compareDaySeq + ")";
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

    //6/12
    static getOneEnrollmentRow(campusProfileID, calendarID) {
        return new Promise((resolve, reject) => {

            let enrollment = {};
            let enrollmentPromise = MshpApi.getEnrollmentByProfileIDCalendarID(campusProfileID, calendarID);
            enrollmentPromise.then(
                function (enrollmentInfo) {
                    if (enrollmentInfo && enrollmentInfo.value.length > 0) {
                        enrollment = enrollmentInfo.value;
                    }
                    else {
                        enrollment = {};
                    }
                    resolve(enrollment);
                }
            );

        }
        );
    }


    //6/12
    //http://apidev.houstonisd.org/mshp/odata/CampusEnrollment?$filter=CampusProfileId eq 1149 and CalendarId eq 473 &$expand=Calendar
    static getEnrollmentByProfileIDCalendarID(campusProfileID, calendarID) {

        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=CampusProfileId eq " + campusProfileID + " and CalendarId eq " + calendarID + "'&$top=1";
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

    // 5/20...this is also needed later even if input screen user does not request all counts for all dates
    static getEnrollmentsByProfileID(profileID) {
        //let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=CampusProfileId eq " + profileID;
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusEnrollment?$filter=CampusProfileId eq " + profileID + "&$expand=Calendar";
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

    // 5/20   ..needed for any case where CalendarID has not already been obtained
    static getCalendarID(schoolYear) {
        let serviceUrl = Config.REST_URL + "mshp/odata/Calendar?$filter=(SchoolYear eq '" + schoolYear + "' and CompareDaySeq eq 1)&$select=Id";
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




    //new version 5/20
    static getCampusProfileID(campusID, calendarID) {

        const calendarIDint = parseInt(calendarID);
        //let serviceUrl = Config.REST_URL + "CampusProfile?$filter=CampusNumber eq '" +  campusID +  "' and SchoolYear eq '" + schoolYear +  "'";
        //let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CampusNumber eq '" + campusID + "' and CalendarId eq " + calendarID + ")&$select=Id";
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CalendarId eq " + calendarIDint + " and CampusNumber eq '" + campusID + "')&$select=Id";
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

    //6/15
    static getProfile(campusID, schoolYear) {
        return new Promise((resolve, reject) => {
            //let hasEnrollments = {};//will have a value prop that holds enrollments array
            let campusProfile = {};
            let calendarID = null;
            let calendarIDPromise = MshpApi.getCalendarID(schoolYear);
            debugger;
            calendarIDPromise.then(
                function (calendarInfo) {
                    if (calendarInfo)
                    calendarID = calendarInfo.value[0].Id;//this is the calID for CompareDaySeq=1 since CampusProfile only has that calID

                    let profilePromise = MshpApi.getCampusProfile(campusID, calendarID);
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

    //6/30
    static getCampusProfileByProfileID(campusProfileID){
           //const calendarIDint = parseInt(calendarID);
        //let serviceUrl = Config.REST_URL + "CampusProfile?$filter=CampusNumber eq '" +  campusID +  "' and SchoolYear eq '" + schoolYear +  "'";
        //let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CampusNumber eq '" + campusID + "' and CalendarId eq " + calendarID + ")&$select=Id";
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(Id eq " + campusProfileID + " )&$expand=OrganizationGroup";
        //let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CalendarId eq " + calendarIDint + " and CampusNumber eq '" + campusID + "')&$select=Id";
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
 


    //6/15
    static getCampusProfile(campusID, calendarID) {

        //const calendarIDint = parseInt(calendarID);
        //let serviceUrl = Config.REST_URL + "CampusProfile?$filter=CampusNumber eq '" +  campusID +  "' and SchoolYear eq '" + schoolYear +  "'";
        //let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CampusNumber eq '" + campusID + "' and CalendarId eq " + calendarID + ")&$select=Id";
        let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CalendarId eq " + calendarID + " and CampusNumber eq '" + campusID + "')&$expand=OrganizationGroup";
        //let serviceUrl = Config.REST_URL + "mshp/odata/CampusProfile?$filter=(CalendarId eq " + calendarIDint + " and CampusNumber eq '" + campusID + "')&$select=Id";
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
}

export default MshpApi;
