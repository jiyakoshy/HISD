import * as types from './actionTypes';
import CandidateSearchCOApi from '../api/candidateSearchCOApi';
import PayGradeApi from '../api/payGradeApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import SharedApi from '../api/sharedApi';
import Config from '../api/config';

export function loadCandidatesByEmpIDSuccess(candidateSearchCO) {
    return { type: types.LOAD_CANDIDATES_BY_EMP_ID_SUCCESS, candidateSearchCO };
}

export function loadCandidatesByEmpID(employeeID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateSearchCOApi.loadCandidatesByEmpID(employeeID).then(candidateSearchCO => {
            if (candidateSearchCO.value.length > 0) {
                if (candidateSearchCO.value[0].EducationOrganization.OrgGrpNaturalKey != 'Campus') {
                    candidateSearchCO.value["0"].PayGradeLevel = '';
                    candidateSearchCO.value["0"].Eligible = 'No';
                    let CandidateSearchGrid = [];
                    let jj = [];
                    let PromisePayGradeApi = PayGradeApi.loadPayGradesEmployee(candidateSearchCO.value["0"].StaffNaturalKey);
                    return PromisePayGradeApi.then(resPayGrade => {
                        candidateSearchCO.value["0"].PayGradeLevel = resPayGrade.PayGradeLevel;
                        let Eligible = "No";
                        let CandidatesEligibles = {};
                        if (candidateSearchCO.value["0"].MiddleName == "") {
                            CandidatesEligibles = {
                                EmpID: candidateSearchCO.value["0"].EmployeeNumber,
                                DepartmentID: candidateSearchCO.value["0"].EducationOrganization.EducationOrgNaturalKey,
                                EmpName: candidateSearchCO.value["0"].LastSurname + "," + candidateSearchCO.value["0"].FirstName,
                                JobFamilyNaturalKey: candidateSearchCO.value["0"].JobFamilyNaturalKey,
                                PayGradeLevel: candidateSearchCO.value["0"].PayGradeLevel,
                                DepartmentName: candidateSearchCO.value["0"].EducationOrganization.NameOfInstitution,
                                Eligible: "No"
                            };
                        }
                        else {
                            CandidatesEligibles = {
                                EmpID: candidateSearchCO.value["0"].EmployeeNumber,
                                DepartmentID: candidateSearchCO.value["0"].EducationOrganization.EducationOrgNaturalKey,
                                EmpName: candidateSearchCO.value["0"].LastSurname + "," + candidateSearchCO.value["0"].FirstName + "," + candidateSearchCO.value["0"].MiddleName,
                                JobFamilyNaturalKey: candidateSearchCO.value["0"].JobFamilyNaturalKey,
                                PayGradeLevel: candidateSearchCO.value["0"].PayGradeLevel,
                                DepartmentName: candidateSearchCO.value["0"].EducationOrganization.NameOfInstitution,
                                Eligible: "No"
                            };
                        }

                        CandidateSearchGrid.push(CandidatesEligibles);
                        CandidateSearchGrid.map(e => {
                            Config.IT_CANDIDATES.map(f => {
                                if (e.PayGradeLevel === f.PayGradeLevel && e.JobFamilyNaturalKey === f.JobFamilyNaturalKey)
                                    e.Eligible = "Yes";
                            });
                        });

                        CandidateSearchGrid.map(e => {
                            Config.NONIT_CANDIDATES.map(f => {
                                if (e.PayGradeLevel === f.PayGradeLevel)
                                    e.Eligible = "Yes";
                            });
                        });
                        if (CandidateSearchGrid["0"].Eligible === "Yes") {
                            dispatch(loadCandidatesByEmpIDSuccess(CandidateSearchGrid));
                        }
                        else {
                            dispatch(loadCandidatesByEmpIDSuccess([]));
                        }

                    });
                }
                else {
                    dispatch(loadCandidatesByEmpIDSuccess([]));
                }
            }
            else {
                dispatch(loadCandidatesByEmpIDSuccess([]));
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCandidatesByEmpNameSuccess(candidateSearchCO) {
    return { type: types.LOAD_CANDIDATES_BY_EMP_NAME_SUCCESS, candidateSearchCO };
}

export function loadCandidatesByEmpName(employeeName) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateSearchCOApi.loadCandidatesByEmpName(employeeName).then(candidateSearchCORes => {
            if (candidateSearchCORes.value.length > 0) {
                let candidateSearchCO = [...candidateSearchCORes.value];
                candidateSearchCO.map(res => {
                    res.PayGradeLevel = '';
                    res.Eligible = 'No';
                });
                candidateSearchCO = candidateSearchCO.filter(e1 => {
                    return (e1.EducationOrganization.OrgGrpNaturalKey != 'Campus');
                });
                let QueryStaffID = '';
                let QueryArrayStaffID = [];
                let StaffsCount = candidateSearchCO.length;

                if (StaffsCount > 0) {
                    candidateSearchCO.map((val, i, arr) => {
                        if ((i % 15) == 0) {
                            if (i != 0)
                                QueryArrayStaffID.push(QueryStaffID);
                            QueryStaffID = '';
                            QueryStaffID = QueryStaffID + "StaffNaturalKey eq '" + val.EmployeeNumber + "' or ";
                        }
                        else {
                            QueryStaffID = QueryStaffID + "StaffNaturalKey eq '" + val.EmployeeNumber + "' or ";
                        }
                    });
                    QueryArrayStaffID.push(QueryStaffID);
                    let QueryHitOccurenece = 0;
                    let PayGradeArray = [];
                    if (QueryArrayStaffID.length > 0) {
                        let NewArrayPayGrades = QueryArrayStaffID.map((val, i, arr) => {
                            let PromisePayGradeApi = PayGradeApi.loadPayGradesFromEmployeeIDs(QueryArrayStaffID[i].slice(0, -4));
                            return PromisePayGradeApi.then(resPayGrade => {
                                resPayGrade.value.map(res => {
                                    PayGradeArray.push({ "StaffNaturalKey": res.StaffNaturalKey, "PayGradeLevel": res.PayGradeLevel });
                                });
                            });
                        });
                        return Promise.all(NewArrayPayGrades).then(function () {
                            if (PayGradeArray.length > 0) {
                                PayGradeArray.map(res1 => {
                                    candidateSearchCO.map(res2 => {
                                        if (res1.StaffNaturalKey == res2.StaffNaturalKey)
                                            res2.PayGradeLevel = res1.PayGradeLevel;
                                    });
                                });

                                candidateSearchCO.map(e => {
                                    Config.IT_CANDIDATES.map(f => {
                                        if (e.PayGradeLevel === f.PayGradeLevel && e.JobFamilyNaturalKey === f.JobFamilyNaturalKey)
                                            e.Eligible = "Yes";
                                    });
                                });

                                candidateSearchCO.map(e => {
                                    Config.NONIT_CANDIDATES.map(f => {
                                        if (e.PayGradeLevel === f.PayGradeLevel)
                                            e.Eligible = "Yes";
                                    });
                                });
                                let candidateSearchCOFiltered = candidateSearchCO.filter(el => {
                                    return (el.Eligible === "Yes");
                                });
                                if (candidateSearchCOFiltered.length > 0) {

                                    let CandidateSearchGrid = [];
                                    candidateSearchCOFiltered.map(e => {
                                        if (e.MiddleName == "") {
                                            CandidateSearchGrid.push({
                                                EmpID: e.EmployeeNumber,
                                                DepartmentID: e.EducationOrgNaturalKey,
                                                EmpName: e.LastSurname + "," + e.FirstName,
                                                JobFamilyNaturalKey: e.JobFamilyNaturalKey,
                                                PayGradeLevel: e.PayGradeLevel,
                                                DepartmentName: e.EducationOrganization.NameOfInstitution
                                            });
                                        }
                                        else {
                                            CandidateSearchGrid.push({
                                                EmpID: e.EmployeeNumber,
                                                DepartmentID: e.EducationOrgNaturalKey,
                                                EmpName: e.LastSurname + "," + e.FirstName + "," + e.MiddleName,
                                                JobFamilyNaturalKey: e.JobFamilyNaturalKey,
                                                PayGradeLevel: e.PayGradeLevel,
                                                DepartmentName: e.EducationOrganization.NameOfInstitution
                                            });
                                        }
                                    });
                                    dispatch(loadCandidatesByEmpNameSuccess(CandidateSearchGrid));
                                }
                                else {
                                    dispatch(loadCandidatesByEmpNameSuccess([]));
                                }
                            }
                            else {
                                dispatch(loadCandidatesByEmpNameSuccess([]));
                            }
                        });
                    }
                    else {
                        dispatch(loadCandidatesByEmpNameSuccess([]));
                    }
                }
                else {
                    dispatch(loadCandidatesByEmpNameSuccess([]));
                }

            }
            else {
                dispatch(loadCandidatesByEmpNameSuccess([]));
            }
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCandidatesByDepartmentIDSuccess(candidateSearchCO) {
    return { type: types.LOAD_CANDIDATE_BY_DEPARTMENT_ID_SUCCESS, candidateSearchCO };
}



export function loadCandidatesByDepartmentID(departmentID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateSearchCOApi.loadCandidatesByDepartmentID(departmentID).then(candidateSearchCO => {

            candidateSearchCO.Staffs.map(res => {
                res.PayGradeLevel = '';
                res.Eligible = 'No';
            });
            let QueryStaffID = '';
            let QueryArrayStaffID = [];
            let StaffsCount = candidateSearchCO.Staffs.length;
            if (StaffsCount > 0) {
                candidateSearchCO.Staffs.map((val, i, arr) => {
                    if ((i % 15) == 0) {
                        if (i != 0)
                            QueryArrayStaffID.push(QueryStaffID);
                        QueryStaffID = '';
                        QueryStaffID = QueryStaffID + "StaffNaturalKey eq '" + val.EmployeeNumber + "' or ";
                    }
                    else {
                        QueryStaffID = QueryStaffID + "StaffNaturalKey eq '" + val.EmployeeNumber + "' or ";
                    }
                });
                QueryArrayStaffID.push(QueryStaffID);
            }
            let QueryHitOccurenece = 0;
            let PayGradeArray = [];
            if (QueryArrayStaffID.length > 0) {

                let NewArrayPayGrades = QueryArrayStaffID.map((val, i, arr) => {
                    let PromisePayGradeApi = PayGradeApi.loadPayGradesFromEmployeeIDs(QueryArrayStaffID[i].slice(0, -4));
                    return PromisePayGradeApi.then(resPayGrade => {
                        resPayGrade.value.map(res => {
                            PayGradeArray.push({ "StaffNaturalKey": res.StaffNaturalKey, "PayGradeLevel": res.PayGradeLevel });
                        });
                    });
                });
                return Promise.all(NewArrayPayGrades).then(function () {
                    if (PayGradeArray.length > 0) {
                        PayGradeArray.map(res1 => {
                            candidateSearchCO.Staffs.map(res2 => {
                                if (res1.StaffNaturalKey == res2.StaffNaturalKey)
                                    res2.PayGradeLevel = res1.PayGradeLevel;
                            });
                        }
                        );

                        candidateSearchCO.Staffs.map(e => {
                            Config.IT_CANDIDATES.map(f => {
                                if (e.PayGradeLevel === f.PayGradeLevel && e.JobFamilyNaturalKey === f.JobFamilyNaturalKey)
                                    e.Eligible = "Yes";
                            });
                        });

                        candidateSearchCO.Staffs.map(e => {
                            Config.NONIT_CANDIDATES.map(f => {
                                if (e.PayGradeLevel === f.PayGradeLevel)
                                    e.Eligible = "Yes";
                            });
                        });

                        let candidateSearchCOFiltered = candidateSearchCO.Staffs.filter(el => {
                            return (el.Eligible === "Yes");
                        });

                        let CandidateSearchGrid = [];
                        candidateSearchCOFiltered.map(e => {
                            if (e.MiddleName == "") {
                                CandidateSearchGrid.push({
                                    EmpID: e.EmployeeNumber,
                                    DepartmentID: candidateSearchCO.EducationOrgNaturalKey,
                                    EmpName: e.LastSurname + "," + e.FirstName,
                                    JobFamilyNaturalKey: e.JobFamilyNaturalKey,
                                    PayGradeLevel: e.PayGradeLevel,
                                    DepartmentName: candidateSearchCO.NameOfInstitution
                                });
                            }
                            else {
                                CandidateSearchGrid.push({
                                    EmpID: e.EmployeeNumber,
                                    DepartmentID: candidateSearchCO.EducationOrgNaturalKey,
                                    EmpName: e.LastSurname + "," + e.FirstName + "," + e.MiddleName,
                                    JobFamilyNaturalKey: e.JobFamilyNaturalKey,
                                    PayGradeLevel: e.PayGradeLevel,
                                    DepartmentName: candidateSearchCO.NameOfInstitution
                                });
                            }
                        });
                        dispatch(loadCandidatesByDepartmentIDSuccess(CandidateSearchGrid));
                    }
                    else {
                        dispatch(loadCandidatesByDepartmentIDSuccess(candidateSearchCO));
                    }
                });


            }
            else {
                dispatch(loadCandidatesByDepartmentIDSuccess(candidateSearchCO));
            }

        }).catch(error => {
            throw (error);
        });
    };
}