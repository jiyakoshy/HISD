  import * as types from './actionTypes';
  import MshpApi from '../api/mshpApi';
  import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
  import Utilities from '../utilities/utilities';


//6/30
export function loadCampusProfileByProfileID(campusProfileID){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.getCampusProfileByProfileID(campusProfileID).then(campusProfileObj => {
        let campusProfile = {};
        if(campusProfileObj)
            campusProfile = campusProfileObj;
            dispatch(loadCampusProfileSuccess(campusProfile));
        }).catch(error => {
            throw (error);
        });
    };
}

    
  //6/26
export function loadSummaryReport(schoolYear, compareDaySeq ){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.getSummaryReport(schoolYear, compareDaySeq ).then( summaryReportRowsObj => {
            let summaryReportRows = [];
            //allRegionTotals
            let summaryRows = [];
            //must aggregate by region
            let region = 'zz';
            let levelGrpID = 0;
                        
            let regionRemoveSlash = '';
            let regionRemoveSpace = '';
            
            let regionsGradeLevelSums = [];
            let regionTotalIEE = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalIPK = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalIKG = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI01 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI02 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI03 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI04 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI05 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI06 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI07 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI08 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI09 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI10 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI11 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};
            let regionTotalI12 = {};//{NorthArea: 0, SouthArea: 0, WestArea: 0 ,EastArea: 0, NoZoneCharter: 0};

            $.each( summaryReportRowsObj, function (key, obj) {
                let newRow = {};
                newRow.summaryID = obj.Id;
                newRow.campusNumber = obj.CampusNumber;
                newRow.schoolYear = obj.SchoolYear;
                newRow.compareDaySeq = obj.CompareDaySeq;
                newRow.instructionDay = obj.InstructionDay;
                newRow.levelGroupID = obj.LevelGroupID;
                newRow.levelGroup = obj.LevelGroup;
                newRow.IEE = obj.IEE;
                newRow.IPK = obj.IPK;
                newRow.IKG = obj.IKG;
                newRow.I01 = obj.I01;
                newRow.I02 = obj.I02;
                newRow.I03 = obj.I03;
                newRow.I04 = obj.I04;
                newRow.I05 = obj.I05;
                newRow.I06 = obj.I06;
                newRow.I07 = obj.I07;
                newRow.I08 = obj.I08;
                newRow.I09 = obj.I09;
                newRow.I10 = obj.I10;
                newRow.I11 = obj.I11;
                newRow.I12 = obj.I12;
                newRow.total = obj.Total;
                newRow.capacity = obj.Capacity;
                newRow.projection = obj.Projection;
                newRow.prevSnapshot = obj.PrevSnapshot;
                newRow.lastYear = obj.LastYear;
                newRow.lastYearCapacity = obj.LastYearCapacity;
                newRow.lastYearEnrollment = obj.LastYearEnrollment;
                newRow.updatedDate = obj.UpdatedDate;
                
                summaryReportRows.push(newRow);
            });

            //now focus on REGION calcs
            let sumIEE = 0;
            let sumIPK = 0;
            let sumIKG = 0;
            let sumI01 = 0;
            let sumI02 = 0;
            let sumI03 = 0;
            let sumI04 = 0;
            let sumI05 = 0;
            let sumI06 = 0;
            let sumI07 = 0;
            let sumI08 = 0;
            let sumI09 = 0;
            let sumI10 = 0;
            let sumI11 = 0;
            let sumI12 = 0;


            let lastRegion = '';

            $.each( summaryReportRows, function (key, obj) {
                //first deal with transitions to new group
                //will differ on very first row since region starts as 'zz'
                if (region !== obj.levelGroup) {
                                
                        if (region == 'zz'){
                            let regionProperty = obj.levelGroup;
                            regionRemoveSlash = regionProperty.replace(/\//g,'');
                            regionRemoveSpace = regionRemoveSlash.replace(/\s/g, '');
                            //no totals accumulated yet, just need to store region name
                        } else {

                            
                            regionTotalIEE[regionRemoveSpace] = sumIEE;
                            regionTotalIPK[regionRemoveSpace] = sumIPK;
                            regionTotalIKG[regionRemoveSpace] = sumIKG;
                            regionTotalI01[regionRemoveSpace] = sumI01;
                            regionTotalI02[regionRemoveSpace] = sumI02;
                            regionTotalI03[regionRemoveSpace] = sumI03;
                            regionTotalI04[regionRemoveSpace] = sumI04;
                            regionTotalI05[regionRemoveSpace] = sumI05;
                            regionTotalI06[regionRemoveSpace] = sumI06;
                            regionTotalI07[regionRemoveSpace] = sumI07;
                            regionTotalI08[regionRemoveSpace] = sumI08;
                            regionTotalI09[regionRemoveSpace] = sumI09;
                            regionTotalI10[regionRemoveSpace] = sumI10;
                            regionTotalI11[regionRemoveSpace] = sumI11;
                            regionTotalI12[regionRemoveSpace] = sumI12;

                            region = obj.levelGroup;
                            console.log('region   total for Grade 2 is  =  ',regionTotalI02[regionRemoveSpace]);
                        }
                        sumIEE = 0;
                        sumIPK = 0;
                        sumIKG = 0;
                        sumI01 = 0;
                        sumI02 = 0;
                        sumI03 = 0;
                        sumI04 = 0;
                        sumI05 = 0;
                        sumI06 = 0;
                        sumI07 = 0;
                        sumI08 = 0;
                        sumI09 = 0;
                        sumI10 = 0;
                        sumI11 = 0;
                        sumI12 = 0;
                }
                sumIEE += obj.IEE;
                sumIPK += obj.IPK;
                sumIKG += obj.IKG;
                sumI01 += obj.I01;
                sumI02 += obj.I02;
                sumI03 += obj.I03;
                sumI04 += obj.I04;
                sumI05 += obj.I05;
                sumI06 += obj.I06;
                sumI07 += obj.I07;
                sumI08 += obj.I08;
                sumI09 += obj.I09;
                sumI10 += obj.I10;
                sumI11 += obj.I11;
                sumI12 += obj.I12;

                lastRegion = obj.levelGroup;
                
            });
            // one more time after loop to get last region stored
            regionTotalIEE[lastRegion] = sumIEE;
            regionTotalIPK[lastRegion] = sumIPK;
            regionTotalIKG[lastRegion] = sumIKG;
            regionTotalI01[lastRegion] = sumI01;
            regionTotalI02[lastRegion] = sumI02;
            regionTotalI03[lastRegion] = sumI03;
            regionTotalI04[lastRegion] = sumI04;
            regionTotalI05[lastRegion] = sumI05;
            regionTotalI06[lastRegion] = sumI06;
            regionTotalI07[lastRegion] = sumI07;
            regionTotalI08[lastRegion] = sumI08;
            regionTotalI09[lastRegion] = sumI09;
            regionTotalI10[lastRegion] = sumI10;
            regionTotalI11[lastRegion] = sumI11;
            regionTotalI12[lastRegion] = sumI12;
 
            //each of the 15 objects, each with 5 properties placed into an array
            let regionTotalsByGrade = [];
            regionTotalsByGrade.push(regionTotalIEE, regionTotalIPK, regionTotalIKG, regionTotalI01, regionTotalI02, regionTotalI03, regionTotalI04);
            regionTotalsByGrade.push(regionTotalI05, regionTotalI06, regionTotalI07, regionTotalI08, regionTotalI09, regionTotalI10, regionTotalI11, regionTotalI12);
        
           dispatch(loadSummaryReportSuccess(regionTotalsByGrade));
           }).catch(error => {
               throw (error);
       });
       
       
   };
}


//6/25
export function loadEnrollmentByCampusEnrollmentID(campusEnrollmentID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.getEnrollmentByCampusEnrollmentID(campusEnrollmentID).then(enrollmentObj => {
            let enrollment = {};
                if(enrollmentObj)
                enrollment = enrollmentObj;
                dispatch(loadOneEnrollmentSuccess(enrollment));
        }).catch(error => {
            throw (error);
        });
    };
}


//6/22
export function LoadOneEnrollment(schoolYear, campusNumber, compareDaySeq){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.getEnrollmentData(schoolYear, campusNumber, compareDaySeq).then( enrollmentObj => {
            let enrollment = {};
                if(enrollmentObj)
                enrollment = enrollmentObj;
            dispatch(loadOneEnrollmentSuccess(enrollment));
        }).catch(error => {
            throw (error);
        });
    };
}
  //new 6/16obj
  export function loadCampusProfile(campusID, schoolYear) {
    return function (dispatch) {
    dispatch(beginAjaxCall());
    
    return MshpApi.getProfile(campusID, schoolYear).then( campusProfileObj => {
        let campusProfile = {};
            if(campusProfileObj)
            campusProfile = campusProfileObj;
        dispatch(loadCampusProfileSuccess(campusProfile));
    }).catch(error => {
        throw (error);
    });
};
}

export function loadCampusProfileSuccess(campusProfile){
    return { type: types.LOAD_CAMPUS_PROFILE_SUCCESS, campusProfile};
}
export function loadOneEnrollmentSuccess(enrollment){
    return { type: types.LOAD_ONE_ENROLLMENT_SUCCESS, enrollment};
}
export function loadSummaryReportSuccess(regionTotalsByGrade){
    return {type: types.LOAD_SUMMARY_REPORT_SUCCESS, regionTotalsByGrade };
}
  //NEW 5/20
  //export function loadAllEnrollmentsByYearCampus(schoolYear, campusID){
    export function loadAllEnrollmentsByYearCampus(campusID, schoolYear) {
       return function (dispatch) {
       dispatch(beginAjaxCall());
      return MshpApi.getEnrollments(campusID, schoolYear).then( enrollmentsObj => {
           let enrollments = [];
           let foundWaiver = false;
           //let calendarIDs = [];

           $.each( enrollmentsObj, function (key, obj) {
            let newEnrollment = {};
            foundWaiver = false;
            if(obj.Calendar){//required to have related Calendar so Plannotes can be checked
                if (obj.Calendar.PlanNotes) {
                    if (obj.Calendar.PlanNotes !== null) {
                            if (obj.Calendar.PlanNotes !== ''){
                                let plannotes = obj.Calendar.PlanNotes.toLowerCase();
                                if (plannotes.search('waiver') > -1) foundWaiver = true; //abandons the record by continuing loop
                            }
                        
                        
                    }
                }
            }

            if(!foundWaiver) {
                if (obj.Calendar.ReportDate) {
                newEnrollment.ReportDate = Utilities.getDateOnly(new Date(Utilities.getDateTime(obj.Calendar.ReportDate)));
                }

                if (obj.Calendar.InstructionDay) {
                    newEnrollment.InstructionDay = (obj.Calendar.InstructionDay !== null) ? obj.Calendar.InstructionDay : 0;
                }

                if (obj.Calendar.CompareDaySeq) {
                    newEnrollment.CompareDaySeq = (obj.Calendar.CompareDaySeq !== null) ? obj.Calendar.CompareDaySeq : 0;
                }
            
                newEnrollment.CampusProfileID = (obj.CampusProfileId !== null) ? obj.CampusProfileId  : 0;
                newEnrollment.CampusEnrollmentID = (obj.Id !== null) ? obj.Id  : 0;
                newEnrollment.CalendarID =  (obj.CalendarId !== null) ? obj.CalendarId  : 0;
                //calendarIDs.push(newEnrollment.CalendarID);
                newEnrollment.UpdatedBy = (obj.UpdatedBy !== null) ? obj.UpdatedBy : '';
                newEnrollment.CreatedBy = (obj.CreatedBy !== null) ? obj.CreatedBy : '';
                
                
                newEnrollment.IEE = (obj.IEE !== null) ? obj.IEE : 0;
                newEnrollment.IPK = (obj.IPK !== null) ? obj.IPK : 0;
                newEnrollment.IKG = (obj.IKG !== null) ? obj.IKG : 0; 
                newEnrollment.I01 = (obj.I01 !== null) ? obj.I01 : 0;
                newEnrollment.I02 = (obj.I02 !== null) ? obj.I02 : 0;
                newEnrollment.I03 = (obj.I03 !== null) ? obj.I03 : 0;
                newEnrollment.I04 = (obj.I04 !== null) ? obj.I04 : 0;
                newEnrollment.I05 = (obj.I05 !== null) ? obj.I05 : 0;
                newEnrollment.I06 = (obj.I06 !== null) ? obj.I06 : 0;
                newEnrollment.I07 = (obj.I07 !== null) ? obj.I07 : 0;
                newEnrollment.I08 = (obj.I08 !== null) ? obj.I08 : 0;
                newEnrollment.I09 = (obj.I09 !== null) ? obj.I09 : 0;
                newEnrollment.I10 = (obj.I10 !== null) ? obj.I10 : 0;
                newEnrollment.I11 = (obj.I11 !== null) ? obj.I11 : 0;
                newEnrollment.I12 = (obj.I12 !== null) ? obj.I12 : 0;
                newEnrollment.Total = (obj.Total !== null) ? obj.Total : 0;
                newEnrollment.CreatedDate = (obj.CreatedDate !== null) ?  obj.CreatedDate  : new Date(Utilities.getDateTime(obj.CreatedDate));
                newEnrollment.UpdatedDate = (obj.UpdatedDate !== null)  ? obj.UpdatedDate  : new Date(Utilities.getDateTime(obj.UpdatedDate));
    
    
                enrollments.push(newEnrollment);
            }
 
        });
           dispatch(loadEnrollmentsByCampusSuccess(enrollments));
           }).catch(error => {
               throw (error);
       });
       
       
   };
}

//new 5/24
export function updateEnrollment(enrollment) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.updateEnrollment(enrollment).then(response => {
          console.log("response inside action------",response);
            dispatch(updateEnrollmentSuccess(enrollment));
        }).catch(error => {
            throw (error);
        });
    };
}

//new 6/22
export function updateCampusProfile(campusProfile) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.updateCampusProfile(campusProfile).then(response => {
          console.log("response inside action------",response);
            dispatch(updateCampusProfileSuccess(campusProfile));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateCampusProfileSuccess(campusProfile) {
    return { type: types.UPDATE_CAMPUS_PROFILE_SUCCESS, campusProfile };
}

export function createCampusEnrollment(enrollment) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.createCampusEnrollment(enrollment).then(response => {
            console.log("jibi action response----",response);
            dispatch(createCampusEnrollmentSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createCampusEnrollmentSuccess(enrollment) {
    return { type: types.CREATE_CAMPUS_ENROLLMENT_SUCCESS, enrollment };
}
/* export function updateEnrollmentsNo(toSave) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.updateEnrollments(toSave).then(response => {
            dispatch(updateEnrollmentsSuccess(response));
        }).catch(error => {
            throw (error);
        });
    };
} */

export function updateEnrollmentSuccess(enrollment) {
    return { type: types.UPDATE_ENROLLMENT_SUCCESS, enrollment };
}


  export function loadEnrollmentsByCampus(campusID, calendarID){
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return MshpApi.getEnrollmentsByCampusAndCalendarID(campusID, calendarID).then( enrollmentsObj => {
            let enrollments = [];
            $.each( enrollmentsObj.value, function (key, obj) {
                let newEnrollment = {};

                newEnrollment.CampusEnrollmentID = (obj.Id !== null) ? obj.Id  : 0;
                newEnrollment.UpdatedBy = (obj.UpdatedBy !== null) ? obj.UpdatedBy : '';
                newEnrollment.CreatedBy = (obj.CreatedBy !== null) ? obj.CreatedBy : '';
                // in new service, CompareDaySeq is not available
                //newEnrollment.CompareDaySeq = obj.CompareDaySeq;
                newEnrollment.IEE = (obj.IEE !== null) ? obj.IEE : 0;
                newEnrollment.IPK = (obj.IPK !== null) ? obj.IPK : 0;
                newEnrollment.IKG = (obj.IKG !== null) ? obj.IKG : 0; 
                newEnrollment.I01 = (obj.I01 !== null) ? obj.I01 : 0;
                newEnrollment.I02 = (obj.I02 !== null) ? obj.I02 : 0;
                newEnrollment.I03 = (obj.I03 !== null) ? obj.I03 : 0;
                newEnrollment.I04 = (obj.I04 !== null) ? obj.I04 : 0;
                newEnrollment.I05 = (obj.I05 !== null) ? obj.I05 : 0;
                newEnrollment.I06 = (obj.I06 !== null) ? obj.I06 : 0;
                newEnrollment.I07 = (obj.I07 !== null) ? obj.I07 : 0;
                newEnrollment.I08 = (obj.I08 !== null) ? obj.I08 : 0;
                newEnrollment.I09 = (obj.I09 !== null) ? obj.I09 : 0;
                newEnrollment.I10 = (obj.I10 !== null) ? obj.I10 : 0;
                newEnrollment.I11 = (obj.I11 !== null) ? obj.I11 : 0;
                newEnrollment.I12 = (obj.I12 !== null) ? obj.I12 : 0;
newEnrollment.Total = (obj.Total !== null) ? obj.Total : 0;
newEnrollment.CreatedDate = (obj.CreatedDate !== null) ?  obj.CreatedDate  : new Date(Utilities.getDateTime(obj.CreatedDate));
newEnrollment.UpdatedDate = (obj.UpdatedDate !== null)  ? obj.UpdatedDate  : new Date(Utilities.getDateTime(obj.UpdatedDate));

                enrollments.push(newEnrollment);
            });
            dispatch(loadEnrollmentsByCampusSuccess(enrollments));
            }).catch(error => {
                throw (error);
        });
    };

  }
  /* export function loadEnrollmentsByCampusNotUsed(campusID, calendarID){
    let profilePromise = MshpApi.getCurrentCampusProfileID(campusID);
    profilePromise.then(
        function (profile) {
            let enrollmentPromise = MshpApi.getEnrollmentsByCalendarAndProfile(profile.CampusProfileID, calendarID).then(enrollmentsObj => {     
                letenrollments = [];
                $.each( enrollmentsObj.value, function (key, obj) {
                let newEnrollment = {};

                newEnrollment.CampusEnrollmentID = (obj.Id !== null) ? obj.Id  : 0;
                
                newEnrollment.UpdatedBy = (obj.UpdatedBy !== null) ? obj.UpdatedBy : '';
                newEnrollment.CreatedBy = (obj.CreatedBy !== null) ? obj.CreatedBy : '';
                // must get this later??
                //newEnrollment.CompareDaySeq = obj.CompareDaySeq;
                newEnrollment.IEE = (obj.IEE !== null) ? obj.IEE : 0;
                newEnrollment.IPK = (obj.IPK !== null) ? obj.IPK : 0;
                newEnrollment.IKG = (obj.IKG !== null) ? obj.IKG : 0; 
                newEnrollment.I01 = (obj.I01 !== null) ? obj.I01 : 0;
                newEnrollment.I02 = (obj.I02 !== null) ? obj.I02 : 0;
                newEnrollment.I03 = (obj.I03 !== null) ? obj.I03 : 0;
                newEnrollment.I04 = (obj.I04 !== null) ? obj.I04 : 0;
                newEnrollment.I05 = (obj.I05 !== null) ? obj.I05 : 0;
                newEnrollment.I06 = (obj.I06 !== null) ? obj.I06 : 0;
                newEnrollment.I07 = (obj.I07 !== null) ? obj.I07 : 0;
                newEnrollment.I08 = (obj.I08 !== null) ? obj.I08 : 0;
                newEnrollment.I09 = (obj.I09 !== null) ? obj.I09 : 0;
                newEnrollment.I10 = (obj.I10 !== null) ? obj.I10 : 0;
                newEnrollment.I11 = (obj.I11 !== null) ? obj.I11 : 0;
                newEnrollment.I12 = (obj.I12 !== null) ? obj.I12 : 0;
                newEnrollment.Total = (obj.Total !== null) ? obj.Total : 0;
                newEnrollment.CreatedDate = (obj.CreatedDate !== null) ?  obj.CreatedDate  : new Date(Utilities.getDateTime(obj.CreatedDate));
                newEnrollment.UpdatedDate = (obj.UpdatedDate !== null)  ? obj.UpdatedDate  : new Date(Utilities.getDateTime(obj.UpdatedDate));

                enrollments.push(newEnrollment);

                });
                dispatch(loadEnrollmentsByCampusSuccess(enrollments));
            }).catch
       
    

        }
   )
}
 */

  export function loadEnrollmentsByCampusSuccess(enrollments) {
      return { type: types.LOAD_ENROLLMENTS_BY_CAMPUS_SUCCESS, enrollments};
  }
  export function clearEnrollments() {
      const enrollments = [];
      return { type: types.CLEAR_ENROLLMENTS_DATA_SUCCESS, enrollments};
  }