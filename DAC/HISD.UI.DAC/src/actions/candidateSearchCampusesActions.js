import * as types from './actionTypes';
import CandidateSearchCampusesApi from '../api/candidateSearchCampusesApi';
import PayGradeApi from '../api/payGradeApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import SharedApi from '../api/sharedApi';
import Config from '../api/config';
import CandidateTypesApi from '../api/candidateTypesApi';

export function loadCampusCandidatesByEmpIDSuccess(candidateSearchCampuses) {
    return { type: types.LOAD_CAMPUS_CANDIDATES_BY_EMP_ID_SUCCESS, candidateSearchCampuses };
}

export function loadCampusCandidatesByEmpID(departmentID, employeeID, yearID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());

        return CandidateSearchCampusesApi.loadCandidatesByEmpID(departmentID, employeeID, yearID).
            then(SearchResults => {
                let staffArrayBeforeFilter = [];
                if (SearchResults) {

                    staffArrayBeforeFilter = CandidateSearchCampusesApi.loadStaffArrayBeforeFilter(SearchResults, departmentID);
                    return SharedApi.getCampusTypeForYear(departmentID, yearID).
                        then(location => {

                            if (location) {
                                let locationValue = location.value;
                                staffArrayBeforeFilter.map(staff => {
                                    if (locationValue == "HS")
                                        staff.Location = "High School";
                                    if (locationValue == "ES")
                                        staff.Location = "Elementary School";
                                    if (locationValue == "MS")
                                        staff.Location = "Middle School";
                                });
                                return CandidateTypesApi.loadJobCodesForCampusProfessional().
                                    then(JobCodeRes => {
                                        if (JobCodeRes) {
                                            let JobCodesEligibility = JobCodeRes.value[0].JobCode;
                                            JobCodesEligibility.map(jobcode => {
                                                staffArrayBeforeFilter.map(staff => {
                                                    if (jobcode.JobCodeNaturalKey === staff.JobCodeNaturalKey) {
                                                        staff.Eligible = true;
                                                        staff.CandidateType = "Campus Based Professional";
                                                    }
                                                });
                                            });
                                            return CandidateTypesApi.loadJobCodesForClassRoomTeachers().
                                                then(SearchRes => {
                                                    if (SearchRes) {
                                                        staffArrayBeforeFilter.map(staff => {
                                                            SearchRes.value[0].JobCode.map(JobCodSearch => {
                                                                if (staff.JobFunctionNaturalKey == JobCodSearch.JobFunctionNaturalKey && staff.JobFamilyNaturalKey == JobCodSearch.JobFamilyNaturalKey) {
                                                                    SearchRes.value[0].SalaryPlanType.map(SalarySearch => {
                                                                        if (staff.SalaryPlanTypeNaturalKey == SalarySearch.SalaryPlanTypeNaturalKey) {
                                                                            staff.Eligible = true;
                                                                            staff.CandidateType = "Classroom Teacher";

                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));

                                                    }
                                                    else {
                                                        dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                                                    }

                                                });

                                        }
                                        else {
                                            dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                                        }
                                    }); //fffff
                            }
                            else {
                                dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                            }
                        });
                }
                else {
                    dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                }


            }).catch(error => {
                throw (error);
            });
    };
}

export function loadCampusCandidatesByEmpNameSuccess(candidateSearchCampuses) {
    return { type: types.LOAD_CAMPUS_CANDIDATES_BY_EMP_NAME_SUCCESS, candidateSearchCampuses };
}

export function loadCampusCandidatesByEmpName(departmentID, employeeName, yearID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());

        return CandidateSearchCampusesApi.loadCandidatesByEmpName(departmentID, employeeName).
            then(SearchResults => {
                let staffArrayBeforeFilter = [];
                if (SearchResults) {
                    staffArrayBeforeFilter = CandidateSearchCampusesApi.loadStaffArrayBeforeFilter(SearchResults, departmentID);
                    return SharedApi.getCampusTypeForYear(departmentID, yearID).
                        then(location => {
                            if (location) {
                                let locationValue = location.value;
                                staffArrayBeforeFilter.map(staff => {
                                    if (locationValue == "HS")
                                        staff.Location = "High School";
                                    if (locationValue == "ES")
                                        staff.Location = "Elementary School";
                                    if (locationValue == "MS")
                                        staff.Location = "Middle School";
                                });

                                return CandidateTypesApi.loadJobCodesForCampusProfessional().
                                    then(JobCodeRes => {
                                        if (JobCodeRes) {
                                            let JobCodesEligibility = JobCodeRes.value[0].JobCode;
                                            JobCodesEligibility.map(jobcode => {
                                                staffArrayBeforeFilter.map(staff => {
                                                    if (jobcode.JobCodeNaturalKey === staff.JobCodeNaturalKey) {
                                                        staff.Eligible = true;
                                                        staff.CandidateType = "Campus Based Professional";
                                                    }
                                                });
                                            });
                                            return CandidateTypesApi.loadJobCodesForClassRoomTeachers().
                                                then(SearchRes => {
                                                    if (SearchRes) {
                                                        staffArrayBeforeFilter.map(staff => {
                                                            SearchRes.value[0].JobCode.map(JobCodSearch => {
                                                                if (staff.JobFunctionNaturalKey == JobCodSearch.JobFunctionNaturalKey && staff.JobFamilyNaturalKey == JobCodSearch.JobFamilyNaturalKey) {
                                                                    SearchRes.value[0].SalaryPlanType.map(SalarySearch => {
                                                                        if (staff.SalaryPlanTypeNaturalKey == SalarySearch.SalaryPlanTypeNaturalKey) {
                                                                            staff.Eligible = true;
                                                                            staff.CandidateType = "Classroom Teacher";

                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                        dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));

                                                    }
                                                    else {
                                                        dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                                                    }

                                                });

                                        }
                                        else {
                                            dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                                        }
                                    }); //ddfd
                            }
                            else {
                                dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                            }
                        });

                }
                else {
                    dispatch(loadCampusCandidatesByEmpIDSuccess(staffArrayBeforeFilter));
                }


            }).catch(error => {
                throw (error);
            });
    };
}

