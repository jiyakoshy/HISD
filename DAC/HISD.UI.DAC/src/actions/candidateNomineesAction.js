import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import CandidateNomineesApi from '../api/candidateNomineesApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function createCandidateNominees(candidateNominees) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateNomineesApi.createCandidateNominees(candidateNominees).then(candidateNominees => {
            dispatch(createCandidateNomineesSuccess(candidateNominees));

        }).catch(error => {
            throw (error);
        });
    };
}

export function createCandidateNomineesSuccess(candidateNominees) {
    return { type: types.CREATE_CANDIDATE_NOMINEES_SUCCESS, candidateNominees };
}

export function loadCandidateNomineesCentralOffice(votingSettingID, locationID,
    candidateTypeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateNomineesApi.loadCandidateNomineesCentralOffice(votingSettingID, locationID,
            candidateTypeID)
            .then(candidateNominees => {
                let QueryDepartmentID = '';
                let QueryStaffID = '';
                candidateNominees.value.map(candidateNominee => {
                    QueryDepartmentID = QueryDepartmentID + "EducationOrgNaturalKey eq '" + candidateNominee.CampusID + "' or ";
                    QueryStaffID = QueryStaffID + "EmployeeNumber  eq '" + candidateNominee.EmployeeID + "' or ";

                });
                const DepartmentNamesApi = SharedApi.getDepartmentsFromDepartmentID(QueryDepartmentID.slice(0, -4));
                return DepartmentNamesApi.then(res => {
                    res.value.map(department => {
                        candidateNominees.value.map(candidateNominee => {
                            if (candidateNominee.CampusID == department.EducationOrgNaturalKey) {
                                candidateNominee.DepartmentName = department.NameOfInstitution;
                            }
                        });
                    }
                    );
                    const StaffNameApi = SharedApi.getStaffFromEmployeeNumber(QueryStaffID.slice(0, -4));
                    return StaffNameApi.then(staffRes => {
                        staffRes.value.map(staff => {
                            candidateNominees.value.map(candidateNominee => {
                                if (candidateNominee.EmployeeID == staff.EmployeeNumber) {
                                    if (staff.MiddleName == "") {
                                        candidateNominee.EmpName = staff.LastSurname + "," + staff.FirstName;
                                    }
                                    else {
                                        candidateNominee.EmpName = staff.LastSurname + "," + staff.FirstName + "," + staff.MiddleName;
                                    }
                                }
                            });
                        }
                        );
                        dispatch(loadCandidateNomineesCentralOfficeSuccess(candidateNominees));
                    });

                });



            }).catch(error => {
                throw (error);
            });
    };
}

export function loadCandidateNomineesCentralOfficeSuccess(candidateNominees) {
    return { type: types.CREATE_CANDIDATE_NOMINEES_CENTRAL_OFFICE_SUCCESS, candidateNominees };
}

export function loadCandidateNomineesUsingCampusID(votingSettingID, campusID, campusName) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateNomineesApi.loadCandidateNomineesUsingCampusID(votingSettingID, campusID, campusName)
            .then(candidateNominees => {
                if (candidateNominees.value.length > 0) {
                    let QueryStaffID = '';
                    candidateNominees.value.map(candidateNominee => {
                        QueryStaffID = QueryStaffID + "EmployeeNumber  eq '" + candidateNominee.EmployeeID + "' or ";

                    });
                    candidateNominees.value.map(candidateNominee => {
                        candidateNominee.DepartmentName = campusName;
                        candidateNominee.CandidateTypeName = candidateNominee.CandidateType.Description;
                    });


                    const StaffNameApi = SharedApi.getStaffFromEmployeeNumber(QueryStaffID.slice(0, -4));
                    return StaffNameApi.then(staffRes => {
                        staffRes.value.map(staff => {
                            candidateNominees.value.map(candidateNominee => {
                                if (candidateNominee.EmployeeID == staff.EmployeeNumber) {
                                    if (staff.MiddleName == "") {
                                        candidateNominee.EmpName = staff.LastSurname + "," + staff.FirstName;
                                    }
                                    else {
                                        candidateNominee.EmpName = staff.LastSurname + "," + staff.FirstName + "," + staff.MiddleName;
                                    }
                                }
                            });
                        }
                        );
                        dispatch(loadCandidateNomineesUsingCampusIDSuccess(candidateNominees));
                    });
                }
                else {
                    dispatch(loadCandidateNomineesUsingCampusIDSuccess(candidateNominees));

                }
            }).catch(error => {
                throw (error);
            });
    };
}

export function loadCandidateNomineesUsingCampusIDSuccess(candidateNominees) {
    return { type: types.LOAD_CANDIDATE_NOMINEES_USING_CAMPUS_ID_SUCCESS, candidateNominees };
}



export function loadCandidateNomineesBasedOnLocation(votingSettingID, locationID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateNomineesApi.loadCandidateNomineesBasedOnLocation(votingSettingID, locationID)
            .then(candidateNominees => {
                candidateNominees.value.map(candidateNominee => {
                    candidateNominee.DepartmentName = "";
                    candidateNominee.EmpName = "";
                });
                let QueryDepartmentID = '';
                let QueryArrayDepartmentID = [];
                let QueryStaffID = '';
                let QueryArrayStaffID = [];
                let candidateNomineesCount = candidateNominees.value.length;
                if (candidateNomineesCount > 0) {
                    candidateNominees.value.map((candidateNominee, i, arr) => {
                        if ((i % 15) == 0) {
                            if (i != 0) {
                                QueryArrayStaffID.push(QueryStaffID);
                                QueryArrayDepartmentID.push(QueryDepartmentID);
                            }
                            QueryStaffID = '';
                            QueryDepartmentID = '';
                            QueryStaffID = QueryStaffID + "EmployeeNumber  eq '" + candidateNominee.EmployeeID + "' or ";
                            QueryDepartmentID = QueryDepartmentID + "EducationOrgNaturalKey eq '" + candidateNominee.CampusID + "' or ";

                        }
                        else {
                            QueryStaffID = QueryStaffID + "EmployeeNumber  eq '" + candidateNominee.EmployeeID + "' or ";
                            QueryDepartmentID = QueryDepartmentID + "EducationOrgNaturalKey eq '" + candidateNominee.CampusID + "' or ";

                        }
                    });
                    QueryArrayStaffID.push(QueryStaffID);
                    QueryArrayDepartmentID.push(QueryDepartmentID);

                    if (QueryArrayDepartmentID.length > 0) {
                        let NewArrayDepartmentNAme = QueryArrayDepartmentID.map((val, i, arr) => {
                            let DepartmentNamesPromise = SharedApi.getDepartmentsFromDepartmentID(QueryArrayDepartmentID[i].slice(0, -4));
                            return DepartmentNamesPromise.then(DepNameRes => {
                                DepNameRes.value.map(department => {
                                    candidateNominees.value.map(candidateNominee => {
                                        if (candidateNominee.CampusID == department.EducationOrgNaturalKey) {
                                            candidateNominee.DepartmentName = department.NameOfInstitution;
                                        }
                                    });
                                });
                            });
                        });
                        return Promise.all(NewArrayDepartmentNAme).then(function () {
                            if (QueryArrayStaffID.length > 0) {
                                let NewArrayStaffNAme = QueryArrayStaffID.map((val, i, arr) => {
                                    let StaffNamePromise = SharedApi.getStaffFromEmployeeNumber(QueryArrayStaffID[i].slice(0, -4));
                                    return StaffNamePromise.then(StaffNameRes => {
                                        StaffNameRes.value.map(staff => {
                                            candidateNominees.value.map(candidateNominee => {
                                                if (candidateNominee.EmployeeID == staff.EmployeeNumber) {
                                                    if (staff.MiddleName == "") {
                                                        candidateNominee.EmpName = staff.LastSurname + "," + staff.FirstName;
                                                    }
                                                    else {
                                                        candidateNominee.EmpName = staff.LastSurname + "," + staff.FirstName + "," + staff.MiddleName;
                                                    }
                                                }
                                            });
                                        });
                                    });

                                });

                                return Promise.all(NewArrayStaffNAme).then(function () {
                                    dispatch(loadCandidateNomineesBasedOnLocationSuccess(candidateNominees));

                                });

                            }
                        });
                    }
                }
            }).catch(error => {
                throw (error);
            });
    };
}

export function loadCandidateNomineesBasedOnLocationSuccess(candidateNominees) {
    return { type: types.LOAD_CANDIDATE_NOMINEES_BASED_ON_LOCATION_SUCCESS, candidateNominees };
}


export function deleteCandidateNominee(candidateNomineeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateNomineesApi.deleteCandidateNominee(candidateNomineeID).then((response) => {
            dispatch(deleteCandidateNomineeSuccess());
        }).catch(error => {
            throw (error);
        });
    };
}

export function deleteCandidateNomineeSuccess() {
    return { type: types.DELETE_CANDIATE_NOMINEE_SUCCESS };
}