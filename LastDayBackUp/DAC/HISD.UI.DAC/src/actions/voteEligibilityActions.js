import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Config from '../api/config';
import VoteEligibilityApi from '../api/voteEligibilityApi';
import SharedApi from '../api/sharedApi';
import CandidateTypesApi from '../api/candidateTypesApi';


export function loadVoteEligibilityNonCampusSuccess(voteEligibility) {
    return { type: types.LOAD_VOTE_ELIGIBILITY_NON_CAMPUS_SUCCESS, voteEligibility };
}

export function loadVoteEligibilityNonCampus(payGradeLevel, JobFamilyNaturalKey) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        let voteEligibility = {
            eligible: 'No',
            campusName: 'Non Campus'
        };
        let voteEligibilityPromise = VoteEligibilityApi.CheckEligibilityNonCampus(payGradeLevel, JobFamilyNaturalKey);
        return voteEligibilityPromise.then(eligibleRes => {
            voteEligibility.eligible = eligibleRes;
            dispatch(loadVoteEligibilityNonCampusSuccess(voteEligibility));
        });
    };
}

export function loadVoteEligibilityCampusSuccess(voteEligibility) {
    return { type: types.LOAD_VOTE_ELIGIBILITY_CAMPUS_SUCCESS, voteEligibility };
}

export function loadVoteEligibilityCampus(jobFamilyNaturalKey, departmentID, yearID, jobCodeNaturalKey,
    jobFunctionNaturalKey, salaryPlanTypeNaturalKey) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        let voteEligibility = {
            eligible: 'No',
            campusName: 'Campus',
            campusType: ''
        };
        let campusTypePromise = SharedApi.getCampusTypeForYear(departmentID, yearID);
        return campusTypePromise.then(res => {
            if (res) {
                let locationValue = res.value;
                if (locationValue == "HS")
                    voteEligibility.campusType = "High School";
                if (locationValue == "ES")
                    voteEligibility.campusType = "Elementary School";
                if (locationValue == "MS")
                    voteEligibility.campusType = "Middle School";
                let jobCodeCampusPromise = CandidateTypesApi.loadJobCodesForCampusProfessional();
                return jobCodeCampusPromise.then(jCCP => {
                    if (jCCP) {
                        let JobCodesEligibility = jCCP.value[0].JobCode;
                         JobCodesEligibility.map(jobCode => {
                            if (jobCode.JobCodeNaturalKey === jobCodeNaturalKey)
                                voteEligibility.eligible = 'Yes';
                        });
                    }
                    return CandidateTypesApi.loadJobCodesForClassRoomTeachers().
                        then(SearchRes => {
                            if (SearchRes) {
                                SearchRes.value[0].JobCode.map(JobCodSearch => {
                                    if (jobFunctionNaturalKey == JobCodSearch.JobFunctionNaturalKey && jobFamilyNaturalKey == JobCodSearch.JobFamilyNaturalKey) {
                                        SearchRes.value[0].SalaryPlanType.map(SalarySearch => {
                                            if (salaryPlanTypeNaturalKey == SalarySearch.SalaryPlanTypeNaturalKey) {
                                                voteEligibility.eligible = 'Yes';

                                            }
                                        });
                                    }
                                });
                            }
                            dispatch(loadVoteEligibilityNonCampusSuccess(voteEligibility));
                        });

                });

            }
            else{
                dispatch(loadVoteEligibilityNonCampusSuccess(voteEligibility));
            }

        });
    };

}
